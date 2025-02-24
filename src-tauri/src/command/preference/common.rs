use std::sync::Arc;

use tauri::{async_runtime::Mutex, AppHandle, Manager, State};

use crate::preference::store::PreferenceStore;

#[tauri::command]
#[specta::specta]
pub fn is_preference_file_exists(handle: State<'_, AppHandle>) -> bool {
    let app_local_data_dir = handle.path().app_local_data_dir().unwrap();
    return app_local_data_dir.join("preference.json").exists();
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
        return Err("Data directory cannot be changed via set_preferences function".into());
    }

    preference.overwrite(&new_preference);
    preference.save().map_err(|e| e.to_string())
}
