use tauri::State;

use crate::definitions::entities::LoadResult;

#[tauri::command]
#[specta::specta]
pub fn get_load_status(status: State<'_, LoadResult>) -> LoadResult {
    (*status).clone()
}
