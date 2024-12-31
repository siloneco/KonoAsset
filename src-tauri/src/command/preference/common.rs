use tauri::{async_runtime::Mutex, State};

use crate::preference::store::PreferenceStore;

#[tauri::command]
#[specta::specta]
pub async fn get_preferences(
    preference: State<'_, Mutex<PreferenceStore>>,
) -> Result<PreferenceStore, String> {
    let preference = preference.lock().await;
    Ok(preference.clone())
}

#[tauri::command]
#[specta::specta]
pub async fn set_preferences(
    preference: State<'_, Mutex<PreferenceStore>>,
    new_preference: PreferenceStore,
) -> Result<(), String> {
    let mut preference = preference.lock().await;

    if preference.get_data_dir() != new_preference.get_data_dir() {
        return Err("Data directory cannot be changed via set_preferences function".into());
    }

    preference.overwrite(&new_preference);
    preference.save().map_err(|e| e.to_string())
}
