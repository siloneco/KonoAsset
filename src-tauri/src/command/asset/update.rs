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
    log::info!("Updating avatar (ID = {:?})", asset.id);
    log::debug!("Updating avatar to: {:?}", asset);

    let id = asset.id.clone();

    let result = {
        let basic_store = basic_store.lock().await;

        basic_store
            .get_avatar_store()
            .update_asset_and_save(asset)
            .await
    };

    if let Ok(_) = &result {
        log::info!("Successfully updated avatar (ID = {:?})", id);
    } else {
        log::error!("Failed to update avatar: {:?}", result);
    }

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
    log::info!("Updating avatar wearable (ID = {:?})", asset.id);
    log::debug!("Updating avatar wearable to: {:?}", asset);

    let id = asset.id.clone();

    let result = {
        let basic_store = basic_store.lock().await;

        basic_store
            .get_avatar_wearable_store()
            .update_asset_and_save(asset)
            .await
    };

    if let Ok(_) = &result {
        log::info!("Successfully updated avatar wearable (ID = {:?})", id);
    } else {
        log::error!("Failed to update avatar wearable: {:?}", result);
    }

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
    log::info!("Updating world object (ID = {:?})", asset.id);
    log::debug!("Updating world object to: {:?}", asset);

    let id = asset.id.clone();

    let result = {
        let basic_store = basic_store.lock().await;

        basic_store
            .get_world_object_store()
            .update_asset_and_save(asset)
            .await
    };

    if let Ok(_) = &result {
        log::info!("Successfully updated world object (ID = {:?})", id);
    } else {
        log::error!("Failed to update world object: {:?}", result);
    }

    match result {
        Ok(_) => Ok(true),
        Err(e) => Err(e),
    }
}
