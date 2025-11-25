use std::{collections::HashMap, path::PathBuf, sync::Arc};

use file::modify_guard::{self, DeletionGuard};
use serde::{Deserialize, Serialize};
use storage::asset_storage::AssetStorage;
use tauri::{AppHandle, State};
use tauri_specta::Event;
use tokio::sync::Mutex;
use uuid::Uuid;

use crate::definitions::entities::ProgressEvent;

#[tauri::command]
#[specta::specta]
pub async fn optimize_and_import_image(
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
    path: PathBuf,
    temporary: bool,
) -> Result<String, String> {
    log::info!(
        "Importing image file to images directory from: {}",
        path.display()
    );

    let images_dir = {
        let store = basic_store.lock().await;
        store.data_dir().join("images")
    };

    if !images_dir.exists() {
        std::fs::create_dir_all(&images_dir).map_err(|e| {
            log::error!("Failed to create images directory: {:?}", e);
            e.to_string()
        })?;
    }

    let filename = create_dest_filename(temporary);
    let dest = images_dir.join(&filename);

    let result = file::resize_and_encode_with_webp(&path, &dest);

    if let Err(e) = result {
        log::error!("Failed to copy image file: {:?}", e);
        return Err(e.to_string());
    }

    log::info!(
        "Successfully imported image file to images directory (dest: {})",
        &dest.display()
    );

    Ok(filename)
}

#[derive(Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct ImageOptimizationResult {
    pub resized: u32,
    pub deleted: u32,
}

#[derive(Deserialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub enum DryOrActual {
    DryRun,
    ActualRun,
}

#[tauri::command]
#[specta::specta]
pub async fn optimize_images_directory(
    asset_storage: State<'_, Arc<Mutex<AssetStorage>>>,
    dry_or_actual: DryOrActual,
    app_handle: State<'_, AppHandle>,
) -> Result<ImageOptimizationResult, String> {
    let dry_run = match dry_or_actual {
        DryOrActual::DryRun => true,
        DryOrActual::ActualRun => false,
    };

    // 同時実行を避けるため、広めに AssetStorage をロックする
    let store = asset_storage.lock().await;
    let app_handle = &*app_handle;

    let images_dir = store.data_dir().join("images");
    let used_filenames = store.get_used_image_filenames().await;

    let mut candidate_images = vec![];
    let mut deleted = 0;

    let mut read_dir = tokio::fs::read_dir(&images_dir).await.map_err(|e| {
        let err = format!("Failed to read directory: {}", e);
        log::error!("{}", err);
        err
    })?;

    while let Some(entry) = read_dir.next_entry().await.map_err(|e| {
        let err = format!("Failed to read directory: {}", e);
        log::error!("{}", err);
        err
    })? {
        let path = entry.path();
        let filename = match path.file_name() {
            Some(filename) => filename.to_string_lossy().to_string(),
            None => {
                log::error!("Failed to get filename from path: {}", path.display());
                continue;
            }
        };
        let extension = match path.extension() {
            Some(extension) => extension.to_string_lossy().to_string().to_ascii_lowercase(),
            None => {
                log::error!("Failed to get extension from path: {}", path.display());
                continue;
            }
        };

        // 一時ファイルの場合はスキップ
        if filename.starts_with("temp_") {
            continue;
        }
        // 画像ファイルではない場合はスキップ
        if extension != "webp" && extension != "jpg" && extension != "jpeg" && extension != "png" {
            continue;
        }

        if !used_filenames.contains(&filename) {
            if dry_run {
                deleted += 1;
            } else {
                modify_guard::delete_single_file(path, &DeletionGuard::new(&images_dir)).map_err(
                    |e| {
                        let err = format!("Failed to delete image file: {}", e);
                        log::error!("{}", err);
                        err
                    },
                )?;
                deleted += 1;
            }
            continue;
        }

        candidate_images.push(path);
    }

    let resizable = if dry_run {
        let result = file::optimize_thumbnails(candidate_images, dry_run, |_, _| {}).await;

        match result {
            Ok(map) => map,
            Err(e) => {
                let err = format!("Failed to optimize thumbnails (dry-run): {}", e);
                log::error!("{}", err);
                return Err(err);
            }
        }
    } else {
        let result =
            file::optimize_thumbnails(candidate_images, dry_run, move |progress, filename| {
                if let Err(e) = ProgressEvent::new(progress * 0.8f32, filename).emit(app_handle) {
                    log::error!("Failed to emit progress event: {}", e);
                }
            })
            .await;

        match result {
            Ok(map) => map,
            Err(e) => {
                let err = format!("Failed to optimize thumbnails: {}", e);
                log::error!("{}", err);
                return Err(err);
            }
        }
    };

    let map = resizable
        .iter()
        .filter_map(|(old, new)| {
            let old_filename = match old.file_name() {
                Some(filename) => filename.to_string_lossy().to_string(),
                None => return None,
            };
            let new_filename = match new.file_name() {
                Some(filename) => filename.to_string_lossy().to_string(),
                None => return None,
            };

            Some((old_filename, new_filename))
        })
        .collect::<HashMap<String, String>>();

    if !dry_run {
        if let Err(e) = ProgressEvent::new(0.8f32, "Replacing...".to_string()).emit(app_handle) {
            log::error!("Failed to emit progress event: {}", e);
        }

        store.replace_thumbnails(map).await.map_err(|e| {
            let err = format!("Failed to replace thumbnails: {}", e);
            log::error!("{}", err);
            err
        })?;

        let amount_of_old_images = resizable.len();

        for (index, (old, _)) in resizable.iter().enumerate() {
            let old_filename = match old.file_name() {
                Some(filename) => filename.to_string_lossy().to_string(),
                None => "".to_string(),
            };

            if let Err(e) = modify_guard::delete_single_file(old, &DeletionGuard::new(&images_dir))
            {
                log::error!("Failed to delete old image: {}", e);
                continue;
            }

            let progress = 0.9f32 + ((index as f32 / amount_of_old_images as f32) * 0.1f32);
            if let Err(e) =
                ProgressEvent::new(progress, format!("Deleting old image: {}", old_filename))
                    .emit(app_handle)
            {
                log::error!("Failed to emit progress event: {}", e);
            }
        }
    }

    Ok(ImageOptimizationResult {
        resized: resizable.len() as u32,
        deleted,
    })
}

fn create_dest_filename(temporary: bool) -> String {
    if temporary {
        format!("temp_{}.webp", Uuid::new_v4().to_string())
    } else {
        format!("{}.webp", Uuid::new_v4().to_string())
    }
}
