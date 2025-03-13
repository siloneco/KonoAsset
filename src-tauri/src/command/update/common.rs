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
        let err = "Update handler is not initialized yet.".to_string();
        log::error!("{}", err);
        return Err(err);
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
        let err = "Update handler is not initialized yet.".to_string();
        log::error!("{}", err);
        return Err(err);
    }

    if !handler.update_available() {
        let err = "No update available.".to_string();
        log::error!("{}", err);
        return Err(err);
    }

    log::info!("Executing update. This will restart the application.");
    let result = handler.execute_update().await;

    match result {
        Ok(_) => Ok(true),
        Err(e) => {
            let err = format!("Failed to execute update: {:?}", e);
            log::error!("{}", err);
            Err(err)
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
        let err = "Update handler is not initialized yet.".to_string();
        log::error!("{}", err);
        return Err(err);
    }

    handler.set_show_notification(false).await;
    Ok(true)
}
