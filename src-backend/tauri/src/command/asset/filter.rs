use std::sync::Arc;

use data_store::{definitions::FilterRequest, provider::StoreProvider, search};
use tauri::{State, async_runtime::Mutex};
use uuid::Uuid;

#[tauri::command]
#[specta::specta]
pub async fn get_filtered_asset_ids(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    request: FilterRequest,
) -> Result<Vec<Uuid>, String> {
    let basic_store = basic_store.lock().await;
    Ok(search::filter(&basic_store, &request).await)
}
