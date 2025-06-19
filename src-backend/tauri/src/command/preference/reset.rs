use std::sync::Arc;

use file::modify_guard::{self, DeletionGuard};
use serde::Deserialize;
use tauri::{AppHandle, Manager, State, async_runtime::Mutex};

use crate::preference::store::PreferenceStore;

#[tauri::command]
#[specta::specta]
pub async fn reset_application(
    handle: State<'_, AppHandle>,
    request: ResetApplicationRequest,
) -> Result<(), String> {
    log::info!("Resetting application...");

    if request.reset_preferences {
        let app_local_data_dir = handle.path().app_local_data_dir().map_err(|e| {
            let err = format!("Unable to get app dir: {}", e);
            log::error!("{}", err);
            err
        })?;
        let preference_path = app_local_data_dir.join("preference.json");

        if preference_path.exists() {
            let result = modify_guard::delete_single_file(
                &preference_path,
                &DeletionGuard::new(&app_local_data_dir),
            )
            .await;

            if let Err(e) = result {
                log::error!("Failed to delete preferences.json: {}", e);
                return Err(e.to_string());
            }
        }

        log::info!("Successfully reset preferences");
    }

    // PreferenceStore がロードできていない場合があるため、try_state で取得する
    let preference_store: Option<State<'_, Arc<Mutex<PreferenceStore>>>> = handle.try_state();

    if let Some(preference_store) = preference_store {
        let user_data_dir = {
            let preference_store = preference_store.lock().await;
            preference_store.get_data_dir().clone()
        };

        if request.delete_metadata {
            let metadata_dir = user_data_dir.join("metadata");

            if metadata_dir.exists() {
                let result = modify_guard::delete_recursive(
                    &metadata_dir,
                    &DeletionGuard::new(&user_data_dir),
                )
                .await;

                if let Err(e) = result {
                    log::error!("Failed to delete metadata directory: {}", e);
                    return Err(e.to_string());
                }
            }

            log::info!("Successfully deleted metadata directory");
        }

        if request.delete_asset_data {
            let asset_data_dir = user_data_dir.join("data");

            if asset_data_dir.exists() {
                let result = modify_guard::delete_recursive(
                    &asset_data_dir,
                    &DeletionGuard::new(&user_data_dir),
                )
                .await;

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
