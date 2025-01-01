use tauri::{async_runtime::Mutex, State};

use crate::{
    data_store::provider::StoreProvider,
    definitions::entities::{Avatar, AvatarWearable, WorldObject},
};

#[tauri::command]
#[specta::specta]
pub async fn update_avatar(
    basic_store: State<'_, Mutex<StoreProvider>>,
    asset: Avatar,
) -> Result<bool, String> {
    let result = {
        let basic_store = basic_store.lock().await;

        basic_store
            .get_avatar_store()
            .update_asset_and_save(asset)
            .await
    };

    match result {
        Ok(_) => Ok(true),
        Err(e) => Err(e),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn update_avatar_wearable(
    basic_store: State<'_, Mutex<StoreProvider>>,
    asset: AvatarWearable,
) -> Result<bool, String> {
    let result = {
        let basic_store = basic_store.lock().await;

        basic_store
            .get_avatar_wearable_store()
            .update_asset_and_save(asset)
            .await
    };

    match result {
        Ok(_) => Ok(true),
        Err(e) => Err(e),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn update_world_object(
    basic_store: State<'_, Mutex<StoreProvider>>,
    asset: WorldObject,
) -> Result<bool, String> {
    let result = {
        let basic_store = basic_store.lock().await;

        basic_store
            .get_world_object_store()
            .update_asset_and_save(asset)
            .await
    };

    match result {
        Ok(_) => Ok(true),
        Err(e) => Err(e),
    }
}
