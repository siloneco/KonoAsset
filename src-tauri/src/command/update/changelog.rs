use std::sync::Arc;

use tauri::State;
use tokio::sync::Mutex;

use crate::{
    changelog::{fetch_and_parse_changelog, pick_changes_in_preferred_lang, LocalizedChanges},
    preference::store::PreferenceStore,
    updater::update_handler::{UpdateChannel, UpdateHandler},
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

    let raw_changelog = if let Some(changelog) = handler.get_changelog() {
        changelog.clone()
    } else {
        let changelog = fetch_and_parse_changelog().await.map_err(|e| {
            let err = format!("Failed to fetch and parse changelog: {}", e);
            log::error!("{}", err);
            err
        })?;

        handler.set_changelog(changelog.clone());

        changelog
    };

    let version = match handler.update_version() {
        Some(v) => v,
        None => {
            let err = "No update available.".to_string();
            log::error!("{}", err);
            return Err(err);
        }
    };

    let (preferred_language, skip_pre_releases) = {
        let preference = preference.lock().await;

        (
            preference.language.clone(),
            preference.update_channel == UpdateChannel::Stable,
        )
    };

    let changelog = pick_changes_in_preferred_lang(
        raw_changelog,
        version,
        &preferred_language,
        skip_pre_releases,
    )
    .await
    .map_err(|e| {
        let err = format!("Failed to pick changes in preferred language: {}", e);
        log::error!("{}", err);
        err
    })?;

    Ok(changelog)
}
