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
    let basic_store = basic_store.lock().await;
    import_avatar(&basic_store, request).await
}

#[tauri::command]
#[specta::specta]
pub async fn request_avatar_wearable_import(
    basic_store: State<'_, Mutex<StoreProvider>>,
    request: AvatarWearableImportRequest,
) -> Result<AvatarWearable, String> {
    let basic_store = basic_store.lock().await;
    import_avatar_wearable(&basic_store, request).await
}

#[tauri::command]
#[specta::specta]
pub async fn request_world_object_import(
    basic_store: State<'_, Mutex<StoreProvider>>,
    request: WorldObjectImportRequest,
) -> Result<WorldObject, String> {
    let basic_store = basic_store.lock().await;
    import_world_object(&basic_store, request).await
}
