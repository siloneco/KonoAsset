use std::sync::Arc;
use tauri::{async_runtime::Mutex, AppHandle, State};

use crate::{
    data_store::provider::StoreProvider,
    statistics::{
        calculate_asset_volumes, get_asset_registration_statistics, AssetRegistrationStatistics,
        AssetVolumeStatistics,
    },
};

#[tauri::command]
#[specta::specta]
pub async fn get_registration_statistics(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
) -> Result<Vec<AssetRegistrationStatistics>, String> {
    let basic_store = basic_store.lock().await;

    let result = get_asset_registration_statistics(&basic_store).await;

    match result {
        Ok(result) => Ok(result),
        Err(e) => {
            log::error!("{}", e);
            Err(e)
        }
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_volume_statistics(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    app_handle: State<'_, AppHandle>,
) -> Result<Vec<AssetVolumeStatistics>, String> {
    let basic_store = basic_store.lock().await;

    let result = calculate_asset_volumes(&basic_store, &app_handle).await;

    match result {
        Ok(result) => Ok(result),
        Err(e) => {
            log::error!("{}", e);
            Err(e)
        }
    }
}
