use std::{fs, path::PathBuf};

use tauri::{async_runtime::Mutex, State};
use uuid::Uuid;

use crate::data_store::provider::StoreProvider;

#[tauri::command]
#[specta::specta]
pub async fn copy_image_file_to_images(
    basic_store: State<'_, Mutex<StoreProvider>>,
    path: String,
    temporary: bool,
) -> Result<String, String> {
    let path = PathBuf::from(path);
    let mut new_path = basic_store.lock().await.data_dir();
    new_path.push("images");

    let filename = if temporary {
        format!(
            "temp_{}.{}",
            Uuid::new_v4().to_string(),
            path.extension()
                .unwrap_or(std::ffi::OsStr::new("png"))
                .to_str()
                .unwrap()
        )
    } else {
        format!(
            "{}.{}",
            Uuid::new_v4().to_string(),
            path.extension()
                .unwrap_or(std::ffi::OsStr::new("png"))
                .to_str()
                .unwrap()
        )
    };

    new_path.push(filename);

    fs::copy(&path, &new_path).unwrap();

    Ok(new_path.file_name().unwrap().to_str().unwrap().to_string())
}
