use tauri::State;

use crate::updater::update_handler::UpdateHandler;

#[tauri::command]
#[specta::specta]
pub async fn check_for_update(update_handler: State<'_, UpdateHandler>) -> Result<bool, String> {
    if !update_handler.is_initialized() {
        return Err(format!("Update handler is not initialized yet."));
    }

    if !update_handler.show_notification().await {
        return Ok(false);
    }

    let new_version_available = update_handler.update_available();
    Ok(new_version_available)
}

#[tauri::command]
#[specta::specta]
pub async fn execute_update(update_handler: State<'_, UpdateHandler>) -> Result<bool, String> {
    if !update_handler.is_initialized() {
        return Err("Update handler is not initialized yet.".into());
    }

    if !update_handler.update_available() {
        return Err("No update available.".into());
    }

    let result = update_handler.execute_update().await;

    match result {
        Ok(_) => Ok(true),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn do_not_notify_update(
    update_handler: State<'_, UpdateHandler>,
) -> Result<bool, String> {
    if !update_handler.is_initialized() {
        return Err("Update handler is not initialized yet.".into());
    }

    update_handler.set_show_notification(false).await;
    Ok(true)
}
