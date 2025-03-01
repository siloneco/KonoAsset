use std::{path::PathBuf, sync::Arc};

use tauri::{async_runtime::Mutex, AppHandle, State};
use uuid::Uuid;

use crate::{adapter, data_store::provider::StoreProvider, task::cancellable_task::TaskContainer};

#[tauri::command]
#[specta::specta]
pub async fn import_from_other_data_store(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    handle: State<'_, AppHandle>,
    path: PathBuf,
) -> Result<Uuid, String> {
    log::info!("Importing assets from external path: {}", path.display());

    let cloned_basic_store = (*basic_store).clone();
    let cloned_app_handle = (*handle).clone();

    let task = task_container
        .lock()
        .await
        .run((*handle).clone(), async move {
            let mut basic_store = cloned_basic_store.lock().await;

            adapter::importer::import_data_store(&mut *basic_store, &path, &cloned_app_handle)
                .await?;

            log::info!(
                "Successfully imported assets from external path: {}",
                path.display()
            );

            Ok(())
        });

    task
}
