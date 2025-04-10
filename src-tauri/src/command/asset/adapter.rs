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
    let current_data_dir = basic_store.lock().await.data_dir();

    if path.starts_with(&current_data_dir) {
        let err = format!(
            "Cannot import assets from the same data store: {}",
            path.display()
        );
        log::error!("{}", err);
        return Err(err);
    }

    log::info!("Importing assets from external path: {}", path.display());

    let cloned_basic_store = (*basic_store).clone();
    let cloned_app_handle = (*handle).clone();

    let task = task_container.lock().await.run(async move {
        let mut basic_store = cloned_basic_store.lock().await;

        if path.is_dir() {
            adapter::importer::import_data_store_from_directory(
                &mut *basic_store,
                &path,
                Some(cloned_app_handle),
            )
            .await?;
        } else {
            adapter::importer::import_data_store_from_zip(
                &mut *basic_store,
                &path,
                Some(cloned_app_handle),
            )
            .await?;
        }

        log::info!(
            "Successfully imported assets from external path: {}",
            path.display()
        );

        Ok(())
    });

    task
}

#[tauri::command]
#[specta::specta]
pub async fn export_as_konoasset_zip(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    handle: State<'_, AppHandle>,
    path: PathBuf,
) -> Result<Uuid, String> {
    let current_data_dir = basic_store.lock().await.data_dir();

    if path.starts_with(&current_data_dir) {
        let err = format!(
            "Export path cannot be inside the data store: {}",
            path.display()
        );
        log::error!("{}", err);
        return Err(err);
    }

    log::info!("Exporting assets as KonoAsset zip to: {}", path.display());

    let cloned_basic_store = (*basic_store).clone();
    let cloned_app_handle = (*handle).clone();

    let task = task_container.lock().await.run(async move {
        adapter::exporter::export_as_konoasset_structured_zip(
            cloned_basic_store,
            &path,
            Some(&cloned_app_handle),
        )
        .await?;

        log::info!(
            "Successfully exported assets as KonoAsset zip to: {}",
            path.display()
        );

        Ok(())
    });

    task
}

#[tauri::command]
#[specta::specta]
pub async fn export_for_avatar_explorer(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    handle: State<'_, AppHandle>,
    path: PathBuf,
) -> Result<Uuid, String> {
    let current_data_dir = basic_store.lock().await.data_dir();

    if path.starts_with(&current_data_dir) {
        let err = format!(
            "Export path cannot be inside the data store: {}",
            path.display()
        );
        log::error!("{}", err);
        return Err(err);
    }

    log::info!(
        "Exporting assets for Avatar Explorer to: {}",
        path.display()
    );

    let cloned_basic_store = (*basic_store).clone();
    let cloned_app_handle = (*handle).clone();

    let task = task_container.lock().await.run(async move {
        adapter::exporter::export_as_avatar_explorer_compatible_structure(
            cloned_basic_store,
            &path,
            Some(&cloned_app_handle),
        )
        .await?;

        log::info!(
            "Successfully exported assets for Avatar Explorer to: {}",
            path.display()
        );

        Ok(())
    });

    task
}

#[tauri::command]
#[specta::specta]
pub async fn export_as_human_readable_zip(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    handle: State<'_, AppHandle>,
    path: PathBuf,
) -> Result<Uuid, String> {
    let current_data_dir = basic_store.lock().await.data_dir();

    if path.starts_with(&current_data_dir) {
        let err = format!(
            "Export path cannot be inside the data store: {}",
            path.display()
        );
        log::error!("{}", err);
        return Err(err);
    }

    log::info!(
        "Exporting assets as human-readable zip to: {}",
        path.display()
    );

    let cloned_basic_store = (*basic_store).clone();
    let cloned_app_handle = (*handle).clone();

    let task = task_container.lock().await.run(async move {
        adapter::exporter::export_as_human_readable_structured_zip(
            cloned_basic_store,
            &path,
            Some(&cloned_app_handle),
        )
        .await?;

        log::info!(
            "Successfully exported assets as human-readable zip to: {}",
            path.display()
        );

        Ok(())
    });

    task
}
