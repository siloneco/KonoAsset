use std::sync::Arc;

use data_store::{delete::delete_asset, provider::StoreProvider};
use tauri::{State, async_runtime::Mutex};
use uuid::Uuid;

#[tauri::command]
#[specta::specta]
pub async fn request_asset_deletion(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    id: Uuid,
) -> Result<(), String> {
    log::info!("Deleting asset with id: {:?}", id);

    let result = {
        let basic_store = basic_store.lock().await;
        delete_asset(&basic_store, id).await
    };

    if result.is_ok() {
        log::info!("Successfully deleted asset: {:?}", id);
    } else {
        log::error!("Failed to delete asset: {:?}", result);
    }

    result
}
