use model::preference::PreferenceStore;
use std::sync::Arc;
use storage::asset_storage::AssetStorage;
use task::TaskContainer;
use tauri::{State, async_runtime::Mutex};
use uuid::Uuid;

use crate::importer::import_wrapper::import_additional_data;

#[tauri::command]
#[specta::specta]
pub async fn import_file_entries_to_asset(
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    preference: State<'_, Arc<Mutex<PreferenceStore>>>,
    asset_id: Uuid,
    paths: Vec<String>,
) -> Result<Vec<Uuid>, String> {
    let mut task_ids = vec![];

    let zip_extraction = (*preference.lock().await).zip_extraction;

    for path in paths {
        let basic_store = (*basic_store).clone();

        let id = task_container.lock().await.run(async move {
            let result = import_additional_data(basic_store, asset_id, path, zip_extraction).await;

            if let Err(e) = result {
                log::error!("Failed to import additional data: {:?}", e);
                return Err(e);
            }

            Ok(())
        })?;

        task_ids.push(id);
    }

    Ok(task_ids)
}
