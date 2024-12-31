use tauri::{async_runtime::Mutex, State};
use uuid::Uuid;

use crate::data_store::{delete::delete_asset, provider::StoreProvider};

#[tauri::command]
#[specta::specta]
pub async fn request_asset_deletion(
    basic_store: State<'_, Mutex<StoreProvider>>,
    id: Uuid,
) -> Result<bool, String> {
    let basic_store = basic_store.lock().await;
    delete_asset(&basic_store, id).await
}
