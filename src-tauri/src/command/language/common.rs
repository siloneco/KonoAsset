use std::{path::PathBuf, sync::Arc};
use tauri::State;
use tokio::sync::Mutex;

use crate::language::{
    load::{load_from_file, load_from_language_code},
    structs::{CustomLanguageFileLoadResult, LanguageCode, LocalizationData},
};

#[tauri::command]
#[specta::specta]
pub async fn set_language_code(
    localization_data: State<'_, Arc<Mutex<LocalizationData>>>,
    language: LanguageCode,
) -> Result<LocalizationData, String> {
    let mut data = localization_data.lock().await;

    if data.language == language {
        return Ok(data.clone());
    }

    let loaded = load_from_language_code(language)?;
    *data = loaded.clone();

    Ok(loaded)
}

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
) -> Result<CustomLanguageFileLoadResult, String> {
    let mut user_provided_data = load_from_file(&path)?;

    let fallback = load_from_language_code(LanguageCode::EnUs).map_err(|e| {
        let err = format!("Failed to load fallback language file: {}", e);
        log::error!("{}", err);
        err
    })?;

    let mut missing_keys = fallback.data.keys().cloned().collect::<Vec<_>>();
    let mut additional_keys = user_provided_data.data.keys().cloned().collect::<Vec<_>>();

    missing_keys.retain(|key| !user_provided_data.data.contains_key(key));
    additional_keys.retain(|key| !fallback.data.contains_key(key));

    for missing_key in &missing_keys {
        user_provided_data
            .data
            .insert(missing_key.clone(), fallback.data[missing_key].clone());
    }

    *localization_data.lock().await = user_provided_data.clone();

    let result =
        CustomLanguageFileLoadResult::new(user_provided_data, missing_keys, additional_keys);

    Ok(result)
}
