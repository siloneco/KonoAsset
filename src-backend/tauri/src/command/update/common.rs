use std::sync::Arc;

use task::TaskContainer;
use tauri::State;
use tokio::sync::Mutex;
use uuid::Uuid;

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
pub async fn download_update(
    update_handler: State<'_, Arc<Mutex<UpdateHandler>>>,
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
) -> Result<Uuid, String> {
    {
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
    }

    let cloned_update_handler = (*update_handler).clone();

    let task = task_container.lock().await.run(async move {
        let mut handler = cloned_update_handler.lock().await;

        handler
            .download_update()
            .await
            .map_err(|e| format!("Failed to download update: {:?}", e))
    });

    task
}

#[tauri::command]
#[specta::specta]
pub async fn install_update(
    update_handler: State<'_, Arc<Mutex<UpdateHandler>>>,
) -> Result<(), String> {
    let handler = update_handler.lock().await;

    if !handler.is_initialized() {
        let err = "Update handler is not initialized yet.".to_string();
        log::error!("{}", err);
        return Err(err);
    }

    if let Err(e) = handler.install_update() {
        log::error!("{}", e);
        return Err(e);
    }

    Ok(())
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
