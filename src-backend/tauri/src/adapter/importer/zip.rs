use std::{env::temp_dir, ffi::OsStr, path::Path};

use file::DeleteOnDrop;
use tauri::AppHandle;
use tauri_specta::Event;
use uuid::Uuid;

use crate::{
    data_store::provider::StoreProvider, definitions::entities::ProgressEvent,
    zip::extractor::extract_zip,
};

use super::directory::internal_import_data_store_from_directory;

pub async fn import_data_store_from_zip<P>(
    data_store_provider: &mut StoreProvider,
    path: P,
    app_handle: Option<AppHandle>,
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
        let app_handle = app_handle.clone();

        if app_handle.is_none() {
            // app_handle will only be None when running in a test environment
            return;
        }
        let app = app_handle.unwrap();

        let emit_result =
            ProgressEvent::new(progress * 90f32, format!("Extracting: {}", filename)).emit(&app);

        if let Err(e) = emit_result {
            log::error!("Failed to emit progress event: {}", e);
        }
    })
    .await
    .map_err(|e| format!("Failed to extract zip: {}", e))?;

    let temp_dir_prefix = temp_dir.to_string_lossy().to_string();
    let progress_callback = move |progress: f32, filename: String| {
        let app_handle = app_handle.clone();

        if app_handle.is_none() {
            // app_handle will only be None when running in a test environment
            return;
        }
        let app = app_handle.unwrap();

        let filename = if filename.starts_with(&temp_dir_prefix) {
            filename[temp_dir_prefix.len()..].to_string()
        } else {
            filename
        };

        let emit_result = ProgressEvent::new(90f32 + (progress * 10f32), filename).emit(&app);

        if let Err(e) = emit_result {
            log::error!("Failed to emit progress event: {}", e);
        }
    };

    internal_import_data_store_from_directory(data_store_provider, temp_dir, progress_callback)
        .await
}

#[cfg(test)]
mod tests {
    use file::modify_guard::{self, FileTransferGuard};

    use super::*;

    #[tokio::test]
    async fn test_import_with_zip_fn() {
        let root = "test/temp/import/zip";
        let src = "test/temp/import/zip/sample2.zip";
        let dest = "test/temp/import/zip/sample1";

        if std::fs::exists(root).unwrap() {
            std::fs::remove_dir_all(root).unwrap();
        }
        std::fs::create_dir_all(root).unwrap();

        modify_guard::copy_file(
            "test/example_root_dir/sample2.zip",
            src,
            false,
            FileTransferGuard::none(),
        )
        .await
        .unwrap();

        modify_guard::copy_dir(
            "test/example_root_dir/sample1",
            dest,
            false,
            FileTransferGuard::none(),
            |_, _| {},
        )
        .await
        .unwrap();

        let mut provider = StoreProvider::create(dest).unwrap();
        provider.load_all_assets_from_files().await.unwrap();

        assert_eq!(provider.get_avatar_store().get_all().await.len(), 1);
        assert_eq!(
            provider.get_avatar_wearable_store().get_all().await.len(),
            1
        );
        assert_eq!(provider.get_world_object_store().get_all().await.len(), 1);
        assert_eq!(provider.get_other_asset_store().get_all().await.len(), 1);

        import_data_store_from_zip(&mut provider, src, None)
            .await
            .unwrap();

        assert_eq!(provider.get_avatar_store().get_all().await.len(), 2);
        assert_eq!(
            provider.get_avatar_wearable_store().get_all().await.len(),
            2
        );
        assert_eq!(provider.get_world_object_store().get_all().await.len(), 2);
        assert_eq!(provider.get_other_asset_store().get_all().await.len(), 2);
    }
}
