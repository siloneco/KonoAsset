use std::sync::Arc;

use tauri::State;
use tokio::sync::Mutex;

use crate::{
    changelog::{generate_changelog, LocalizedChanges},
    preference::store::PreferenceStore,
    updater::update_handler::UpdateHandler,
};

#[tauri::command]
#[specta::specta]
pub async fn get_changelog(
    update_handler: State<'_, Arc<Mutex<UpdateHandler>>>,
    preference: State<'_, Arc<Mutex<PreferenceStore>>>,
) -> Result<Vec<LocalizedChanges>, String> {
    let mut handler = update_handler.lock().await;

    if !handler.is_initialized() {
        let err = "Update handler is not initialized yet.".to_string();
        log::error!("{}", err);
        return Err(err);
    }

    let version = match handler.update_version() {
        Some(v) => v,
        None => {
            let err = "No update available.".to_string();
            log::error!("{}", err);
            return Err(err);
        }
    };

    if let Some(changelog) = handler.get_changelog() {
        return Ok(changelog.clone());
    }

    let preferred_language = &preference.lock().await.language;

    let changelog = generate_changelog(version, preferred_language)
        .await
        .map_err(|e| {
            let err = format!("Failed to generate changelog: {}", e);
            log::error!("{}", err);
            err
        })?;

    handler.set_changelog(changelog.clone());

    Ok(changelog)
}
