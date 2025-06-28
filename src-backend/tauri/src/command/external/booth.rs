use std::sync::Arc;

use booth::{BoothAssetInfo, BoothFetcher, PximgResolver};
use model::preference::PreferenceStore;
use tauri::{State, async_runtime::Mutex};

#[tauri::command]
#[specta::specta]
pub async fn get_asset_info_from_booth(
    booth_fetcher: State<'_, Mutex<BoothFetcher>>,
    booth_item_id: u64,
) -> Result<BoothAssetInfo, String> {
    log::info!(
        "Fetching asset description from Booth (Booth Item ID = {:?})",
        booth_item_id
    );

    let result = {
        let mut fetcher = booth_fetcher.lock().await;
        fetcher.fetch(booth_item_id).await
    };

    if let Ok(info) = &result {
        log::info!(
            "Successfully fetched asset description from Booth (Booth Item ID = {:?})",
            booth_item_id
        );
        log::debug!("Fetched info: {:?}", info);
    } else {
        log::error!("Failed to fetch asset description from Booth: {:?}", result);
    }

    result.map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub async fn resolve_pximg_filename(
    pximg_resolver: State<'_, Arc<Mutex<PximgResolver>>>,
    url: String,
) -> Result<String, String> {
    let result = {
        let mut resolver = pximg_resolver.lock().await;
        resolver.resolve(&url).await
    };

    result.map_err(|e| {
        log::error!("Failed to resolve pximg filename: {}", e);
        e.to_string()
    })
}

#[tauri::command]
#[specta::specta]
pub async fn get_booth_url(
    preference: State<'_, Arc<Mutex<PreferenceStore>>>,
    id: u64,
) -> Result<String, String> {
    let app_lang_code = {
        let preference = preference.lock().await;
        preference.language.clone()
    };

    let booth_lang_code = app_lang_code.booth_lang_code();
    let booth_url = format!("https://booth.pm/{}/items/{}", booth_lang_code, id);

    Ok(booth_url)
}
