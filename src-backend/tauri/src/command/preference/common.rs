use std::sync::Arc;

use tauri::{async_runtime::Mutex, State};

use crate::{definitions::entities::InitialSetup, preference::store::PreferenceStore};

#[tauri::command]
#[specta::specta]
pub async fn require_initial_setup(
    initial_setup: State<'_, Arc<Mutex<InitialSetup>>>,
) -> Result<bool, String> {
    let mut initial_setup = initial_setup.lock().await;

    if initial_setup.require_initial_setup {
        initial_setup.update();
    }

    return Ok(initial_setup.require_initial_setup);
}

#[tauri::command]
#[specta::specta]
pub async fn get_preferences(
    preference: State<'_, Arc<Mutex<PreferenceStore>>>,
) -> Result<PreferenceStore, String> {
    let preference = preference.lock().await;
    Ok(preference.clone())
}

#[tauri::command]
#[specta::specta]
pub async fn set_preferences(
    preference: State<'_, Arc<Mutex<PreferenceStore>>>,
    new_preference: PreferenceStore,
) -> Result<(), String> {
    let mut preference = preference.lock().await;

    if preference.get_data_dir() != new_preference.get_data_dir() {
        let err = "Data directory cannot be changed via set_preferences function".to_string();
        log::error!("{}", err);
        return Err(err);
    }

    preference.overwrite(&new_preference);
    preference.save().map_err(|e| {
        let err = format!("Failed to save preferences: {}", e);
        log::error!("{}", err);
        err
    })
}
