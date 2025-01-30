use std::sync::Arc;

use tauri::{async_runtime::Mutex, State};
use uuid::Uuid;

use crate::{
    data_store::{provider::StoreProvider, search},
    definitions::entities::FilterRequest,
};

#[tauri::command]
#[specta::specta]
pub async fn get_filtered_asset_ids(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    request: FilterRequest,
) -> Result<Vec<Uuid>, String> {
    let basic_store = basic_store.lock().await;
    Ok(search::filter(&basic_store, &request).await)
}
