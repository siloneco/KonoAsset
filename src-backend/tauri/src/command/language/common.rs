use language::{CustomLanguageFileLoadResult, LocalizationData, load_from_file};
use std::{path::PathBuf, sync::Arc};
use tauri::State;
use tokio::sync::Mutex;

#[tauri::command]
#[specta::specta]
pub async fn get_current_language_data(
    localization_data: State<'_, Arc<Mutex<LocalizationData>>>,
) -> Result<LocalizationData, String> {
    return Ok(localization_data.lock().await.clone());
}

#[tauri::command]
#[specta::specta]
pub async fn load_language_file(
    localization_data: State<'_, Arc<Mutex<LocalizationData>>>,
    path: PathBuf,
    fallback_keys: Vec<String>,
) -> Result<CustomLanguageFileLoadResult, String> {
    let user_provided_data = load_from_file(&path)?;

    let mut missing_keys = fallback_keys.clone();
    let mut additional_keys = user_provided_data.data.keys().cloned().collect::<Vec<_>>();

    missing_keys.retain(|key| !user_provided_data.data.contains_key(key));
    additional_keys.retain(|key| !fallback_keys.contains(key));

    *localization_data.lock().await = user_provided_data.clone();

    let result =
        CustomLanguageFileLoadResult::new(user_provided_data, missing_keys, additional_keys);

    Ok(result)
}
