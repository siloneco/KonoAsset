use std::sync::Arc;

use tauri::{AppHandle, State};
use tokio::sync::Mutex;

use crate::deep_link::definitions::StartupDeepLinkStore;

#[tauri::command]
#[specta::specta]
pub async fn request_startup_deep_link_execution(
    app_handle: State<'_, AppHandle>,
    startup_deep_links: State<'_, Arc<Mutex<StartupDeepLinkStore>>>,
) -> Result<(), String> {
    let mut store = startup_deep_links.lock().await;

    if let Some(deep_links) = store.get() {
        crate::deep_link::execute_deep_links(&app_handle, &deep_links);
    }

    Ok(())
}
