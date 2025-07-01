use std::sync::Arc;

use storage::{asset_storage::AssetStorage, definitions::FilterRequest, search};
use tauri::{State, async_runtime::Mutex};
use uuid::Uuid;

#[tauri::command]
#[specta::specta]
pub async fn get_filtered_asset_ids(
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
    request: FilterRequest,
) -> Result<Vec<Uuid>, String> {
    let basic_store = basic_store.lock().await;
    Ok(search::filter(&basic_store, &request).await)
}
