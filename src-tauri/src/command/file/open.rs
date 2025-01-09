use std::path::PathBuf;

use tauri::{async_runtime::Mutex, AppHandle, Manager, State};

use crate::{data_store::provider::StoreProvider, file_opener, preference::store::PreferenceStore};

#[tauri::command]
#[specta::specta]
pub async fn open_managed_dir(
    basic_store: State<'_, Mutex<StoreProvider>>,
    id: String,
) -> Result<(), String> {
    let mut path = basic_store.lock().await.data_dir();
    path.push("data");
    path.push(id);

    file_opener::open_in_file_manager(&path)
}

#[tauri::command]
#[specta::specta]
pub async fn open_data_dir(pref_store: State<'_, Mutex<PreferenceStore>>) -> Result<(), String> {
    let path = &pref_store.lock().await.data_dir_path;
    file_opener::open_in_file_manager(path)
}

#[tauri::command]
#[specta::specta]
pub async fn open_metadata_dir(
    pref_store: State<'_, Mutex<PreferenceStore>>,
) -> Result<(), String> {
    let path = pref_store.lock().await.data_dir_path.join("metadata");
    file_opener::open_in_file_manager(&path)
}

#[tauri::command]
#[specta::specta]
pub async fn open_asset_data_dir(
    pref_store: State<'_, Mutex<PreferenceStore>>,
) -> Result<(), String> {
    let path = pref_store.lock().await.data_dir_path.join("data");
    file_opener::open_in_file_manager(&path)
}

#[tauri::command]
#[specta::specta]
pub fn open_app_dir(handle: State<'_, AppHandle>) -> Result<(), String> {
    let path = handle.path().app_local_data_dir().unwrap();
    file_opener::open_in_file_manager(&path)
}

#[tauri::command]
#[specta::specta]
pub fn open_file_in_file_manager(path: String) -> Result<(), String> {
    let path = PathBuf::from(path);
    file_opener::open_in_file_manager(&path)
}

#[tauri::command]
#[specta::specta]
pub async fn open_logs_dir(handle: State<'_, AppHandle>) -> Result<(), String> {
    let path = handle.path().app_log_dir().unwrap();
    file_opener::open_in_file_manager(&path)
}
