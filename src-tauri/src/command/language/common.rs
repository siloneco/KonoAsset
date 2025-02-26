use std::{path::PathBuf, sync::Arc};
use tauri::State;
use tokio::sync::Mutex;

use crate::language::{
    load::{load_from_file, load_from_language_code},
    structs::{LanguageCode, LocalizationData},
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
) -> Result<LocalizationData, String> {
    let data = load_from_file(&path)?;

    *localization_data.lock().await = data.clone();

    return Ok(data);
}
