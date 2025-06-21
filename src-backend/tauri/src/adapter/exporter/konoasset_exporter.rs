use std::path::{MAIN_SEPARATOR, Path, PathBuf};
use std::sync::Arc;

use async_zip::base::write::ZipFileWriter;
use async_zip::{Compression, ZipEntryBuilder};
use data_store::provider::StoreProvider;
use file::DeleteOnDrop;
use tauri::AppHandle;
use tauri_specta::Event;
use tokio::fs::File;
use tokio::sync::Mutex;

use crate::definitions::entities::ProgressEvent;

use super::util::new_zip_dir;

pub async fn export_as_konoasset_structured_zip<P>(
    store_provider: Arc<Mutex<StoreProvider>>,
    path: P,
    app: Option<&AppHandle>,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    let mut cleanup = DeleteOnDrop::new(path.as_ref().to_path_buf());

    let mut file = File::create(path.as_ref())
        .await
        .map_err(|e| e.to_string())?;
    let mut writer = ZipFileWriter::with_tokio(&mut file);

    let root_dir = store_provider.lock().await.data_dir();

    let dir_entries = get_flattened_dir_entries(root_dir.clone()).await?;

    let total_count = dir_entries.len();
    let mut processed_count = 0;

    for entry in dir_entries {
        let relative_path = entry.strip_prefix(&root_dir).map_err(|e| e.to_string())?;
        let relative_path_str = relative_path.to_string_lossy().to_string();

        let relative_path_str = if MAIN_SEPARATOR == '\\' {
            relative_path_str.replace(MAIN_SEPARATOR, "/")
        } else {
            relative_path_str
        };

        if entry.is_dir() {
            new_zip_dir(&mut writer, format!("{}/", relative_path_str)).await?;
        } else {
            let file_name = entry
                .file_name()
                .unwrap_or_default()
                .to_string_lossy()
                .to_string();

            if !(file_name.starts_with("temp_") && relative_path_str.starts_with("images")) {
                let data = tokio::fs::read(entry).await.map_err(|e| e.to_string())?;
                let builder =
                    ZipEntryBuilder::new(relative_path_str.clone().into(), Compression::Stored);

                writer
                    .write_entry_whole(builder, &data)
                    .await
                    .map_err(|e| e.to_string())?;
            }
        }

        if let Some(app) = app {
            let emit_result = ProgressEvent::new(
                ((processed_count as f32) / (total_count as f32)) * 100f32,
                relative_path_str.clone(),
            )
            .emit(app);

            if let Err(e) = emit_result {
                log::error!("Failed to emit progress event: {:?}", e);
            }
        }

        processed_count += 1;
    }

    writer.close().await.map_err(|e| e.to_string())?;

    cleanup.mark_as_completed();

    Ok(())
}

async fn get_flattened_dir_entries<P>(path: P) -> Result<Vec<PathBuf>, String>
where
    P: AsRef<Path> + Send + Sync + 'static,
{
    let mut entries = Vec::new();

    let mut read_dir = tokio::fs::read_dir(path).await.map_err(|e| e.to_string())?;
    while let Some(entry) = read_dir.next_entry().await.map_err(|e| e.to_string())? {
        let entry_path = entry.path();

        if entry_path.is_dir() {
            entries.push(entry_path.clone());
            entries.extend(Box::pin(get_flattened_dir_entries(entry_path)).await?);
        } else {
            entries.push(entry_path);
        }
    }

    Ok(entries)
}

#[cfg(test)]
mod tests {
    use file::modify_guard::{self, FileTransferGuard};

    use super::*;

    fn trim_base<B: AsRef<Path>>(path_vec: Vec<PathBuf>, base: B) -> Vec<String> {
        let base = base.as_ref();

        path_vec
            .iter()
            .map(|p| {
                let relative_path = p.strip_prefix(base).unwrap();
                let relative_path_str = relative_path.to_string_lossy().to_string();

                if MAIN_SEPARATOR == '\\' {
                    relative_path_str.replace(MAIN_SEPARATOR, "/")
                } else {
                    relative_path_str
                }
            })
            .collect::<Vec<_>>()
    }

    #[tokio::test]
    async fn test_konoasset_export_fn() {
        let dest = "test/temp/export/konoasset";
        let zip = format!("{dest}/exported.zip");
        let provider = format!("{dest}/provider");
        let extracted = format!("{dest}/extracted");

        if std::fs::exists(dest).unwrap() {
            std::fs::remove_dir_all(dest).unwrap();
        }
        std::fs::create_dir_all(&extracted).unwrap();

        modify_guard::copy_dir(
            "../test/example_root_dir/sample1",
            provider.clone(),
            false,
            FileTransferGuard::none(),
            |_, _| {},
        )
        .await
        .unwrap();

        let mut store_provider = StoreProvider::create(&provider).unwrap();
        store_provider.load_all_assets_from_files().await.unwrap();

        let store_provider = Arc::new(Mutex::new(store_provider));

        export_as_konoasset_structured_zip(store_provider, &zip, None)
            .await
            .unwrap();

        zip::extract_zip(&zip, &extracted, |_, _| {}).await.unwrap();

        let src_entries = trim_base(
            get_flattened_dir_entries(provider.clone()).await.unwrap(),
            provider.clone(),
        );
        let extracted_entries = trim_base(
            get_flattened_dir_entries(extracted.clone()).await.unwrap(),
            extracted.clone(),
        );

        assert_eq!(src_entries, extracted_entries);
    }
}
