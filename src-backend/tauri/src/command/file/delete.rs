use std::sync::Arc;

use file::modify_guard::{self, DeletionGuard};
use model::preference::PreferenceStore;
use storage::asset_storage::AssetStorage;
use tauri::State;
use tokio::sync::Mutex;
use uuid::Uuid;

#[tauri::command]
#[specta::specta]
pub async fn delete_entry_from_asset_data_dir(
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
    preference: State<'_, Arc<Mutex<PreferenceStore>>>,
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

    let use_trash_bin = {
        let preference = preference.lock().await;
        preference.use_trash_bin
    };

    if !path.is_file() && !path.is_dir() {
        let err = format!("Path is not a file or directory: {:?}", path);
        log::error!("{}", err);
        return Err(err);
    }

    if use_trash_bin {
        modify_guard::trash_recursive(&path, &DeletionGuard::new(&path)).map_err(|e| {
            let err = format!("Failed to delete entry: {:?}", e);
            log::error!("{}", err);
            err
        })?;
    } else {
        modify_guard::delete_recursive_completely(&path, &DeletionGuard::new(&path))
            .await
            .map_err(|e| {
                let err = format!("Failed to delete entry: {:?}", e);
                log::error!("{}", err);
                err
            })?;
    }

    Ok(())
}
