use serde::Deserialize;
use tauri::{async_runtime::Mutex, AppHandle, Manager, State};

use crate::preference::store::PreferenceStore;

#[tauri::command]
#[specta::specta]
pub async fn reset_application(
    handle: State<'_, AppHandle>,
    request: ResetApplicationRequest,
) -> Result<(), String> {
    log::info!("Resetting application...");

    if request.reset_preferences {
        let path = handle
            .path()
            .app_local_data_dir()
            .unwrap()
            .join("preference.json");

        if path.exists() {
            let result = std::fs::remove_file(path);

            if let Err(e) = result {
                log::error!("Failed to delete preferences.json: {}", e);
                return Err(e.to_string());
            }
        }

        log::info!("Successfully reset preferences");
    }

    let preference_store: Option<State<'_, Mutex<PreferenceStore>>> = handle.try_state();

    if let Some(preference_store) = preference_store {
        let app_data_dir = {
            let preference_store = preference_store.lock().await;
            preference_store.get_data_dir().clone()
        };

        if request.delete_metadata {
            let metadata_dir = app_data_dir.join("metadata");

            if metadata_dir.exists() {
                let result = std::fs::remove_dir_all(metadata_dir);

                if let Err(e) = result {
                    log::error!("Failed to delete metadata directory: {}", e);
                    return Err(e.to_string());
                }
            }

            log::info!("Successfully deleted metadata directory");
        }

        if request.delete_asset_data {
            let asset_data_dir = app_data_dir.join("data");

            if asset_data_dir.exists() {
                let result = std::fs::remove_dir_all(asset_data_dir);

                if let Err(e) = result {
                    log::error!("Failed to delete asset data directory: {}", e);
                    return Err(e.to_string());
                }
            }

            log::info!("Successfully deleted asset data directory");
        }
    }

    log::info!("Successfully reset application. Restarting...");
    handle.restart();
}

#[derive(Deserialize, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct ResetApplicationRequest {
    reset_preferences: bool,
    delete_metadata: bool,
    delete_asset_data: bool,
}
