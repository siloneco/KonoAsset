use std::sync::Arc;
use task::TaskContainer;
use tauri::{AppHandle, State, async_runtime::Mutex};
use uuid::Uuid;

use crate::{
    data_store::provider::StoreProvider,
    statistics::{
        AssetRegistrationStatistics, AssetVolumeStatistics, AssetVolumeStatisticsCache,
        calculate_asset_volumes, get_asset_registration_statistics,
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
pub async fn execute_volume_statistics_calculation_task(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    statistics_cache: State<'_, Arc<Mutex<AssetVolumeStatisticsCache>>>,
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    app_handle: State<'_, AppHandle>,
) -> Result<Uuid, String> {
    let cloned_basic_store = (*basic_store).clone();
    let cloned_statistics_cache = (*statistics_cache).clone();
    let cloned_app_handle = (*app_handle).clone();

    let task = task_container.lock().await.run(async move {
        let mut statistics_cache = cloned_statistics_cache.lock().await;

        if statistics_cache.get().is_some() {
            return Ok(());
        }

        let result = calculate_asset_volumes(cloned_basic_store, &cloned_app_handle).await;

        if let Err(e) = result {
            log::error!("Failed to calculate asset volumes: {}", e);
            return Err(e);
        }

        statistics_cache.set_cache(result.unwrap());

        Ok(())
    });

    task
}

#[tauri::command]
#[specta::specta]
pub async fn get_volume_statistics_cache(
    statistics_cache: State<'_, Arc<Mutex<AssetVolumeStatisticsCache>>>,
) -> Result<Option<Vec<AssetVolumeStatistics>>, String> {
    let statistics_cache = statistics_cache.lock().await;
    Ok(statistics_cache.get().cloned())
}
