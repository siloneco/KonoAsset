use std::sync::Arc;

use tauri::State;
use tokio::sync::Mutex;
use uuid::Uuid;

use crate::data_store::provider::StoreProvider;

#[tauri::command]
#[specta::specta]
pub async fn delete_entry_from_asset_data_dir(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
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
        return Err(format!("File or directory does not exist: {:?}", path));
    }

    if path.is_file() {
        tokio::fs::remove_file(&path)
            .await
            .map_err(|e| e.to_string())?;
    } else if path.is_dir() {
        tokio::fs::remove_dir_all(&path)
            .await
            .map_err(|e| e.to_string())?;
    } else {
        return Err(format!("Path is not a file or directory: {:?}", path));
    }

    Ok(())
}
