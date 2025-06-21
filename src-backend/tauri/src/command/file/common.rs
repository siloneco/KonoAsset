use std::{collections::HashMap, path::PathBuf, sync::Arc};

use booth::PximgResolver;
use data_store::{
    find::{FileInfo, find_unitypackage},
    provider::{MigrateResult, StoreProvider},
};
use model::preference::PreferenceStore;
use task::TaskContainer;
use tauri::{AppHandle, State, async_runtime::Mutex};
use tauri_specta::Event;
use uuid::Uuid;

use crate::definitions::entities::ProgressEvent;

#[tauri::command]
#[specta::specta]
pub async fn get_directory_path(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    id: Uuid,
) -> Result<String, String> {
    let mut app_dir = basic_store.lock().await.data_dir();
    app_dir.push("data");
    app_dir.push(id.to_string());

    match app_dir.to_str() {
        Some(ans) => Ok(ans.to_string()),
        None => {
            let err = format!("Failed to convert path to string (id = {:?})", id);
            log::error!("{}", err);
            return Err(err);
        }
    }
}

#[tauri::command]
#[specta::specta]
pub async fn list_unitypackage_files(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    id: Uuid,
) -> Result<HashMap<String, Vec<FileInfo>>, String> {
    let mut dir = basic_store.lock().await.data_dir();
    dir.push("data");
    dir.push(id.to_string());

    if !dir.exists() {
        let err = format!("Directory does not exist: {}", dir.display());
        log::error!("{}", err);
        return Err(err);
    }

    Ok(find_unitypackage(&dir)?)
}

#[tauri::command]
#[specta::specta]
pub async fn migrate_data_dir(
    preference: State<'_, Arc<Mutex<PreferenceStore>>>,
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    pximg_resolver: State<'_, Arc<Mutex<PximgResolver>>>,
    handle: State<'_, AppHandle>,
    new_path: PathBuf,
    migrate_data: bool,
) -> Result<Uuid, String> {
    log::info!(
        "Data directory migration triggered (dest: {})",
        new_path.display()
    );

    if !new_path.is_dir() {
        let err = format!("New path is not a directory: {}", new_path.display());
        log::error!("{}", err);
        return Err(err);
    }

    if migrate_data && new_path.exists() {
        let read_dir = new_path
            .read_dir()
            .map_err(|e| format!("Failed to read directory: {}", e))?;
        let entry_count = read_dir.count();

        if entry_count > 0 {
            let err = format!(
                "Directory is not empty (entry count: {}): {}",
                entry_count,
                new_path.display()
            );
            log::error!("{}", err);
            return Err(err);
        }
    }

    let cloned_basic_store = (*basic_store).clone();
    let cloned_preference = (*preference).clone();
    let cloned_pximg_resolver = (*pximg_resolver).clone();
    let cloned_app_handle = (*handle).clone();

    let task = task_container.lock().await.run(async move {
        let mut basic_store = cloned_basic_store.lock().await;

        if migrate_data {
            log::info!("Migrating data to new path: {}", new_path.display());

            let progress_callback = |percentage: f32, filename: String| {
                if let Err(e) = ProgressEvent::new(percentage, filename).emit(&cloned_app_handle) {
                    log::error!("Failed to emit progress event: {:?}", e);
                }
            };

            let result = basic_store
                .migrate_data_dir(&new_path, progress_callback)
                .await
                .map_err(|e| {
                    let msg = format!("Failed to migrate data: {:?}", e);
                    log::error!("{}", msg);
                    msg
                })?;

            if result == MigrateResult::Migrated {
                log::info!("Data migration completed");
            } else if result == MigrateResult::MigratedButFailedToDeleteOldDir {
                log::warn!("Data migration completed, but failed to delete old directory");
            }
        }

        let mut preference = cloned_preference.lock().await;
        let mut new_preference = preference.clone();
        new_preference.set_data_dir(new_path.clone());

        preference.overwrite(&new_preference);
        loader::wrapper::save_preference_store(&preference).map_err(|e| e.to_string())?;

        cloned_pximg_resolver
            .lock()
            .await
            .change_images_dir(new_path.join("images"));

        if !migrate_data {
            if let Err(e) = basic_store.set_data_dir_and_reload(&new_path).await {
                log::error!("Failed to load all assets from files: {}", e);
                return Err(e);
            }
        }

        log::info!(
            "Successfully changed data directory to: {}",
            new_path.display()
        );

        Ok(())
    });

    task
}

#[tauri::command]
#[specta::specta]
pub async fn get_image_absolute_path(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    filename: String,
) -> Result<String, String> {
    let mut path = basic_store.lock().await.data_dir();
    path.push("images");
    path.push(&filename);

    match path.to_str() {
        Some(ans) => Ok(ans.to_string()),
        None => {
            return Err(format!(
                "Failed to get absolute path for image (filename = {})",
                filename
            ));
        }
    }
}

#[tauri::command]
#[specta::specta]
pub async fn extract_non_existent_paths(paths: Vec<PathBuf>) -> Result<Vec<PathBuf>, String> {
    let mut non_existent_paths = Vec::new();

    for path in paths {
        if !path.exists() {
            non_existent_paths.push(path);
        }
    }

    Ok(non_existent_paths)
}
