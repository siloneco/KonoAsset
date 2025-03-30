use std::path::{Path, PathBuf, MAIN_SEPARATOR};
use std::sync::Arc;

use async_zip::base::write::ZipFileWriter;
use async_zip::{Compression, ZipEntryBuilder};
use tauri::AppHandle;
use tauri_specta::Event;
use tokio::fs::File;
use tokio::sync::Mutex;

use crate::data_store::provider::StoreProvider;
use crate::definitions::entities::ProgressEvent;
use crate::file::cleanup::DeleteOnDrop;

use super::util::new_zip_dir;

pub async fn export_as_konoasset_structured_zip<P>(
    store_provider: Arc<Mutex<StoreProvider>>,
    path: P,
    app: &AppHandle,
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
            let data = tokio::fs::read(entry).await.map_err(|e| e.to_string())?;
            let builder =
                ZipEntryBuilder::new(relative_path_str.clone().into(), Compression::Stored);

            writer
                .write_entry_whole(builder, &data)
                .await
                .map_err(|e| e.to_string())?;
        }

        let emit_result = ProgressEvent::new(
            ((processed_count as f32) / (total_count as f32)) * 100f32,
            relative_path_str.clone(),
        )
        .emit(app);

        if let Err(e) = emit_result {
            log::error!("Failed to emit progress event: {:?}", e);
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
