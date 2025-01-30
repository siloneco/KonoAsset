use std::sync::Arc;

use tauri::{async_runtime::Mutex, AppHandle, State};
use uuid::Uuid;

use crate::{
    data_store::provider::StoreProvider,
    definitions::import_request::{
        AvatarImportRequest, AvatarWearableImportRequest, WorldObjectImportRequest,
    },
    importer::import_wrapper::{import_avatar, import_avatar_wearable, import_world_object},
    task::cancellable_task::TaskContainer,
};

#[tauri::command]
#[specta::specta]
pub async fn request_avatar_import(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    handle: State<'_, AppHandle>,
    request: AvatarImportRequest,
) -> Result<Uuid, String> {
    log::info!("Importing avatar from: {:?}", request.absolute_paths);
    log::debug!("Importing avatar: {:?}", request);

    let cloned_basic_store = (*basic_store).clone();
    let cloned_app_handle = (*handle).clone();

    let task = task_container
        .lock()
        .await
        .run((*handle).clone(), async move {
            let basic_store = cloned_basic_store.lock().await;
            let result = import_avatar(&basic_store, request, &cloned_app_handle).await;

            if let Ok(avatar) = result {
                log::info!("Successfully imported avatar: {:?}", avatar);
            } else {
                log::error!("Failed to import avatar: {:?}", result);
            }
        });

    task
}

#[tauri::command]
#[specta::specta]
pub async fn request_avatar_wearable_import(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    handle: State<'_, AppHandle>,
    request: AvatarWearableImportRequest,
) -> Result<Uuid, String> {
    log::info!(
        "Importing avatar wearable from: {:?}",
        request.absolute_paths
    );
    log::debug!("Importing avatar wearable: {:?}", request);

    let cloned_basic_store = (*basic_store).clone();
    let cloned_app_handle = (*handle).clone();

    let task = task_container
        .lock()
        .await
        .run((*handle).clone(), async move {
            let basic_store = cloned_basic_store.lock().await;
            let result = import_avatar_wearable(&basic_store, request, &cloned_app_handle).await;

            if let Ok(avatar) = result {
                log::info!("Successfully imported avatar: {:?}", avatar);
            } else {
                log::error!("Failed to import avatar: {:?}", result);
            }
        });

    task
}

#[tauri::command]
#[specta::specta]
pub async fn request_world_object_import(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    task_container: State<'_, Arc<Mutex<TaskContainer>>>,
    handle: State<'_, AppHandle>,
    request: WorldObjectImportRequest,
) -> Result<Uuid, String> {
    log::info!("Importing world object from: {:?}", request.absolute_paths);
    log::debug!("Importing world object: {:?}", request);

    let cloned_basic_store = (*basic_store).clone();
    let cloned_app_handle = (*handle).clone();

    let task = task_container
        .lock()
        .await
        .run((*handle).clone(), async move {
            let basic_store = cloned_basic_store.lock().await;
            let result = import_world_object(&basic_store, request, &cloned_app_handle).await;

            if let Ok(avatar) = result {
                log::info!("Successfully imported avatar: {:?}", avatar);
            } else {
                log::error!("Failed to import avatar: {:?}", result);
            }
        });

    task
}
