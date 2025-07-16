use std::sync::Arc;

use file::modify_guard::{self, DeletionGuard};
use storage::asset_storage::AssetStorage;
use tauri::State;
use tokio::sync::Mutex;
use uuid::Uuid;

#[tauri::command]
#[specta::specta]
pub async fn delete_entry_from_asset_data_dir(
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
    asset_id: Uuid,
    entry_name: String,
) -> Result<(), String> {
    let path = {
        let store = basic_store.lock().await;
        store
            .data_dir()
            .join("data")
            .join(asset_id.to_string())
            .join(entry_name)
    };

    if !path.exists() {
        let err = format!("File or directory does not exist: {:?}", path);
        log::error!("{}", err);
        return Err(err);
    }

    if path.is_file() {
        modify_guard::delete_single_file(&path, &DeletionGuard::new(&path)).map_err(|e| {
            let err = format!("Failed to delete file: {:?}", e);
            log::error!("{}", err);
            err
        })?;
    } else if path.is_dir() {
        modify_guard::delete_recursive(&path, &DeletionGuard::new(&path)).map_err(|e| {
            let err = format!("Failed to delete directory: {:?}", e);
            log::error!("{}", err);
            err
        })?;
    } else {
        let err = format!("Path is not a file or directory: {:?}", path);
        log::error!("{}", err);
        return Err(err);
    }

    Ok(())
}
