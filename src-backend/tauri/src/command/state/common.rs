use std::sync::Arc;

use state::{AppState, StateHandler};
use tauri::State;
use tokio::sync::Mutex;

#[tauri::command]
#[specta::specta]
pub async fn get_app_state(
    state_handler: State<'_, Arc<Mutex<StateHandler>>>,
) -> Result<AppState, String> {
    let state_handler = state_handler.lock().await;
    Ok(state_handler.get_state().clone())
}

#[tauri::command]
#[specta::specta]
pub async fn save_app_state(
    state_handler: State<'_, Arc<Mutex<StateHandler>>>,
    state: AppState,
) -> Result<(), String> {
    let mut state_handler = state_handler.lock().await;
    state_handler.set_state(state);
    state_handler.save().map_err(|e| e.to_string())?;
    Ok(())
}
