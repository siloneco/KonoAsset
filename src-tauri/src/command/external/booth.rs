use tauri::{async_runtime::Mutex, State};

use crate::{
    booth::fetcher::BoothFetcher, data_store::provider::StoreProvider,
    definitions::results::BoothInfo,
};

#[tauri::command]
#[specta::specta]
pub async fn get_asset_description_from_booth(
    basic_store: State<'_, Mutex<StoreProvider>>,
    booth_fetcher: State<'_, Mutex<BoothFetcher>>,
    booth_item_id: u64,
) -> Result<BoothInfo, String> {
    let mut images_dir = basic_store.lock().await.data_dir();
    images_dir.push("images");

    let result = {
        let mut fetcher = booth_fetcher.lock().await;
        fetcher.fetch(booth_item_id, images_dir).await
    };

    match result {
        Ok((asset_description, estimated_asset_type)) => Ok(BoothInfo {
            description: asset_description,
            estimated_asset_type,
        }),
        Err(e) => Err(e.to_string()),
    }
}
