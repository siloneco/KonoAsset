use std::{path::PathBuf, sync::Arc};

use model::preference::PreferenceStore;
use storage::asset_storage::AssetStorage;
use tauri::{AppHandle, Manager, State, async_runtime::Mutex};

#[tauri::command]
#[specta::specta]
pub async fn open_managed_dir(
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
    id: String,
) -> Result<(), String> {
    let mut path = basic_store.lock().await.data_dir();
    path.push("data");
    path.push(id);

    file::open_in_file_manager(&path)
}

#[tauri::command]
#[specta::specta]
pub async fn open_data_dir(
    pref_store: State<'_, Arc<Mutex<PreferenceStore>>>,
) -> Result<(), String> {
    let path = &pref_store.lock().await.data_dir_path;
    file::open_in_file_manager(&path)
}

#[tauri::command]
#[specta::specta]
pub async fn open_metadata_dir(
    pref_store: State<'_, Arc<Mutex<PreferenceStore>>>,
) -> Result<(), String> {
    let path = pref_store.lock().await.data_dir_path.join("metadata");
    file::open_in_file_manager(&path)
}

#[tauri::command]
#[specta::specta]
pub async fn open_asset_data_dir(
    pref_store: State<'_, Arc<Mutex<PreferenceStore>>>,
) -> Result<(), String> {
    let path = pref_store.lock().await.data_dir_path.join("data");
    file::open_in_file_manager(&path)
}

#[tauri::command]
#[specta::specta]
pub fn open_app_dir(handle: State<'_, AppHandle>) -> Result<(), String> {
    let path = handle
        .path()
        .app_local_data_dir()
        .map_err(|e| format!("Unable to get app dir: {}", e))?;
    file::open_in_file_manager(&path)
}

#[tauri::command]
#[specta::specta]
pub fn open_file_in_file_manager(path: PathBuf) -> Result<(), String> {
    file::open_in_file_manager(&path)
}

#[tauri::command]
#[specta::specta]
pub async fn open_logs_dir(handle: State<'_, AppHandle>) -> Result<(), String> {
    let path = handle
        .path()
        .app_log_dir()
        .map_err(|e| format!("Unable to get log dir: {}", e))?;
    file::open_in_file_manager(&path)
}
