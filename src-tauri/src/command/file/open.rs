use std::path::PathBuf;

use tauri::{async_runtime::Mutex, State};

use crate::{data_store::provider::StoreProvider, file_opener};

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
pub async fn open_file_in_file_manager(path: String) -> Result<(), String> {
    let path = PathBuf::from(path);
    file_opener::open_in_file_manager(&path)
}

#[tauri::command]
#[specta::specta]
pub async fn open_data_dir(basic_store: State<'_, Mutex<StoreProvider>>) -> Result<(), String> {
    let path = basic_store.lock().await.data_dir();
    file_opener::open_in_file_manager(&path)
}
