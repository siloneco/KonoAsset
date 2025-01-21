use std::path::PathBuf;

use tauri::{async_runtime::Mutex, State};
use uuid::Uuid;

use crate::{
    data_store::provider::StoreProvider,
    file::modify_guard::{self, FileTransferGuard},
};

#[tauri::command]
#[specta::specta]
pub async fn copy_image_file_to_images(
    basic_store: State<'_, Mutex<StoreProvider>>,
    path: String,
    temporary: bool,
) -> Result<String, String> {
    log::info!("Copying image file to images directory from: {}", path);

    let src = PathBuf::from(path);
    let images_dir = {
        let store = basic_store.lock().await;
        store.data_dir().join("images")
    };

    let filename = create_dest_filename(&src, temporary);

    log::info!("Filename: {}", &filename);
    let dest = images_dir.join(&filename);

    let result = modify_guard::copy_file(
        &src,
        &dest,
        false,
        FileTransferGuard::new(None, Some(images_dir)),
    );

    if let Err(e) = result {
        log::error!("Failed to copy image file: {:?}", e);
        return Err(e.to_string());
    }

    log::info!(
        "Successfully copied image file to images directory (dest: {})",
        &dest.display()
    );

    Ok(filename)
}

fn create_dest_filename(src: &PathBuf, temporary: bool) -> String {
    let extension = src
        .extension()
        .unwrap_or(std::ffi::OsStr::new("png"))
        .to_str();

    let extension = if let Some(ext) = extension {
        ext
    } else {
        "png"
    };

    if temporary {
        format!("temp_{}.{}", Uuid::new_v4().to_string(), extension)
    } else {
        format!("{}.{}", Uuid::new_v4().to_string(), extension)
    }
}
