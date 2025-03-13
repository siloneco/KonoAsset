use std::sync::Arc;

use tauri::State;
use tokio::sync::Mutex;

use crate::updater::update_handler::UpdateHandler;

#[tauri::command]
#[specta::specta]
pub async fn check_for_update(
    update_handler: State<'_, Arc<Mutex<UpdateHandler>>>,
) -> Result<bool, String> {
    let handler = update_handler.lock().await;

    if !handler.is_initialized() {
        log::error!("Update handler is not initialized yet.");
        return Err(format!("Update handler is not initialized yet."));
    }

    if !handler.show_notification().await {
        return Ok(false);
    }

    let new_version_available = handler.update_available();
    Ok(new_version_available)
}

#[tauri::command]
#[specta::specta]
pub async fn execute_update(
    update_handler: State<'_, Arc<Mutex<UpdateHandler>>>,
) -> Result<bool, String> {
    let handler = update_handler.lock().await;

    if !handler.is_initialized() {
        log::error!("Update handler is not initialized yet.");
        return Err("Update handler is not initialized yet.".into());
    }

    if !handler.update_available() {
        log::error!("No update available.");
        return Err("No update available.".into());
    }

    log::info!("Executing update. This will restart the application.");
    let result = handler.execute_update().await;

    match result {
        Ok(_) => Ok(true),
        Err(e) => {
            log::error!("Failed to execute update: {:?}", e);
            Err(e.to_string())
        },
    }
}

#[tauri::command]
#[specta::specta]
pub async fn do_not_notify_update(
    update_handler: State<'_, Arc<Mutex<UpdateHandler>>>,
) -> Result<bool, String> {
    let mut handler = update_handler.lock().await;

    if !handler.is_initialized() {
        log::error!("Update handler is not initialized yet.");
        return Err("Update handler is not initialized yet.".into());
    }

    handler.set_show_notification(false).await;
    Ok(true)
}
