use std::{path::PathBuf, sync::Arc};

use tauri::{async_runtime::Mutex, AppHandle, State};
use uuid::Uuid;

use crate::{
    data_store::provider::StoreProvider,
    file::modify_guard::{self, FileTransferGuard},
    importer::import_wrapper::import_additional_data,
    task::cancellable_task::TaskContainer,
};

#[tauri::command]
#[specta::specta]
pub async fn import_file_entries_to_asset(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    handle: State<'_, AppHandle>,
    asset_id: Uuid,
    paths: Vec<String>,
) -> Result<Vec<Uuid>, String> {
    let mut task_ids = vec![];

    for path in paths {
        let basic_store = (*basic_store).clone();

        let id = task_container
            .lock()
            .await
            .run((*handle).clone(), async move {
                let result = import_additional_data(basic_store, asset_id, path).await;

                if let Err(e) = result {
                    log::error!("Failed to import additional data: {:?}", e);
                }
            })?;

        task_ids.push(id);
    }

    Ok(task_ids)
}

#[tauri::command]
#[specta::specta]
pub async fn copy_image_file_to_images(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    path: PathBuf,
    temporary: bool,
) -> Result<String, String> {
    log::info!(
        "Copying image file to images directory from: {}",
        path.display()
    );

    let images_dir = {
        let store = basic_store.lock().await;
        store.data_dir().join("images")
    };

    let filename = create_dest_filename(&path, temporary);

    log::info!("Filename: {}", &filename);
    let dest = images_dir.join(&filename);

    let result =
        modify_guard::copy_file(&path, &dest, false, FileTransferGuard::dest(&images_dir)).await;

    if let Err(e) = result {
        log::error!("Failed to copy image file: {:?}", e);
        return Err(e.to_string());
    }

    log::info!(
        "Successfully copied image file to images directory (dest: {})",
        &dest.display()
    );

    Ok(filename)
}

fn create_dest_filename(src: &PathBuf, temporary: bool) -> String {
    let extension = src
        .extension()
        .unwrap_or(std::ffi::OsStr::new("png"))
        .to_str();

    let extension = if let Some(ext) = extension {
        ext
    } else {
        "png"
    };

    if temporary {
        format!("temp_{}.{}", Uuid::new_v4().to_string(), extension)
    } else {
        format!("{}.{}", Uuid::new_v4().to_string(), extension)
    }
}
