use std::sync::Arc;
use tauri::{async_runtime::Mutex, State};
use uuid::Uuid;

use crate::{
    data_store::provider::StoreProvider,
    file::list::{list_top_files_and_directories, SimplifiedDirEntry},
};

#[tauri::command]
#[specta::specta]
pub async fn list_asset_dir_entry(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    id: Uuid,
) -> Result<Vec<SimplifiedDirEntry>, String> {
    let dir = {
        let store = basic_store.lock().await;
        store.data_dir().join("data").join(id.to_string())
    };

    let result = list_top_files_and_directories(&dir).await;

    result.map_err(|e| {
        log::error!("Failed to list directory: {:?}", e);
        e.to_string()
    })
}
