use file::{SimplifiedDirEntry, list_top_files_and_directories};
use std::sync::Arc;
use storage::asset_storage::AssetStorage;
use tauri::{State, async_runtime::Mutex};
use uuid::Uuid;

#[tauri::command]
#[specta::specta]
pub async fn list_asset_dir_entry(
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
    id: Uuid,
) -> Result<Vec<SimplifiedDirEntry>, String> {
    let dir = {
        let store = basic_store.lock().await;
        store.data_dir().join("data").join(id.to_string())
    };

    let result = list_top_files_and_directories(&dir).await;

    result.map_err(|e| {
        let err = format!("Failed to list directory: {:?}", e);
        log::error!("{}", err);
        err
    })
}
