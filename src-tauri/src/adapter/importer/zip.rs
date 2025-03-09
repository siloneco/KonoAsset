use std::{env::temp_dir, ffi::OsStr, path::Path};

use tauri::AppHandle;
use tauri_specta::Event;
use uuid::Uuid;

use crate::{
    data_store::provider::StoreProvider, definitions::entities::ProgressEvent,
    file::cleanup::DeleteOnDrop, zip::extractor::extract_zip,
};

use super::directory::internal_import_data_store_from_directory;

pub async fn import_data_store_from_zip<P>(
    data_store_provider: &mut StoreProvider,
    path: P,
    app_handle: AppHandle,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    let path = path.as_ref();

    if !path.is_file() {
        return Err(format!(
            "Invalid path. Expected a zip file: {}",
            path.display()
        ));
    }

    let extension = path.extension().unwrap_or(OsStr::new("")).to_str();

    if extension != Some("zip") {
        return Err(format!(
            "Invalid file extension. Expected a zip file: {}",
            path.display()
        ));
    }

    let temp_dir = temp_dir().join(format!("KonoAsset-temp-zip-extract-{}", Uuid::new_v4()));
    let _cleanup = DeleteOnDrop::new(temp_dir.clone());

    extract_zip(path, temp_dir.clone(), |progress, filename| {
        let emit_result = ProgressEvent::new(progress * 90f32, format!("Extracting: {}", filename))
            .emit(&app_handle);

        if let Err(e) = emit_result {
            log::error!("Failed to emit progress event: {}", e);
        }
    })
    .await
    .map_err(|e| format!("Failed to extract zip: {}", e))?;

    let temp_dir_prefix = temp_dir.to_string_lossy().to_string();
    let progress_callback = move |progress: f32, filename: String| {
        let filename = if filename.starts_with(&temp_dir_prefix) {
            filename[temp_dir_prefix.len()..].to_string()
        } else {
            filename
        };

        let emit_result =
            ProgressEvent::new(90f32 + (progress * 10f32), filename).emit(&app_handle);

        if let Err(e) = emit_result {
            log::error!("Failed to emit progress event: {}", e);
        }
    };

    internal_import_data_store_from_directory(data_store_provider, temp_dir, progress_callback)
        .await
}
