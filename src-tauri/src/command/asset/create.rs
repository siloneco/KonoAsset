use tauri::{async_runtime::Mutex, State};

use crate::{
    data_store::provider::StoreProvider,
    definitions::{
        entities::{Avatar, AvatarWearable, WorldObject},
        import_request::{
            AvatarImportRequest, AvatarWearableImportRequest, WorldObjectImportRequest,
        },
    },
    importer::import_wrapper::{import_avatar, import_avatar_wearable, import_world_object},
};

#[tauri::command]
#[specta::specta]
pub async fn request_avatar_import(
    basic_store: State<'_, Mutex<StoreProvider>>,
    request: AvatarImportRequest,
) -> Result<Avatar, String> {
    log::info!("Importing avatar from: {:?}", request.absolute_paths);
    log::debug!("Importing avatar: {:?}", request);

    let result = {
        let basic_store = basic_store.lock().await;
        import_avatar(&basic_store, request).await
    };

    if let Ok(avatar) = &result {
        log::info!("Successfully imported avatar: {:?}", avatar);
    } else {
        log::error!("Failed to import avatar: {:?}", result);
    }

    result
}

#[tauri::command]
#[specta::specta]
pub async fn request_avatar_wearable_import(
    basic_store: State<'_, Mutex<StoreProvider>>,
    request: AvatarWearableImportRequest,
) -> Result<AvatarWearable, String> {
    log::info!(
        "Importing avatar wearable from: {:?}",
        request.absolute_paths
    );
    log::debug!("Importing avatar wearable: {:?}", request);

    let result = {
        let basic_store = basic_store.lock().await;
        import_avatar_wearable(&basic_store, request).await
    };

    if let Ok(avatar_wearable) = &result {
        log::info!(
            "Successfully imported avatar wearable: {:?}",
            avatar_wearable
        );
    } else {
        log::error!("Failed to import avatar wearable: {:?}", result);
    }

    result
}

#[tauri::command]
#[specta::specta]
pub async fn request_world_object_import(
    basic_store: State<'_, Mutex<StoreProvider>>,
    request: WorldObjectImportRequest,
) -> Result<WorldObject, String> {
    log::info!("Importing world object from: {:?}", request.absolute_paths);
    log::debug!("Importing world object: {:?}", request);

    let result = {
        let basic_store = basic_store.lock().await;
        import_world_object(&basic_store, request).await
    };

    if let Ok(world_object) = &result {
        log::info!("Successfully imported world object: {:?}", world_object);
    } else {
        log::error!("Failed to import world object: {:?}", result);
    }

    result
}
