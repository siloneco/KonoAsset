use std::sync::Arc;

use tauri::{async_runtime::Mutex, State};

use crate::{data_store::provider::StoreProvider, definitions::entities::AssetUpdatePayload};

#[tauri::command]
#[specta::specta]
pub async fn update_asset(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    payload: AssetUpdatePayload,
) -> Result<bool, String> {
    let cloned_payload = payload.clone();

    let id = match payload {
        AssetUpdatePayload::Avatar(avatar) => {
            log::info!("Updating asset (ID = {:?})", avatar.id);
            log::debug!("Updating asset to: {:?}", avatar);
            avatar.id
        }
        AssetUpdatePayload::AvatarWearable(avatar_wearable) => {
            log::info!("Updating avatar wearable (ID = {:?})", avatar_wearable.id);
            log::debug!("Updating avatar wearable to: {:?}", avatar_wearable);
            avatar_wearable.id
        }
        AssetUpdatePayload::WorldObject(world_object) => {
            log::info!("Updating world object (ID = {:?})", world_object.id);
            log::debug!("Updating world object to: {:?}", world_object);
            world_object.id
        }
        AssetUpdatePayload::OtherAsset(other_asset) => {
            log::info!("Updating other asset (ID = {:?})", other_asset.id);
            log::debug!("Updating other asset to: {:?}", other_asset);
            other_asset.id
        }
    };

    let result = {
        let basic_store = basic_store.lock().await;

        basic_store.update_asset_and_save(cloned_payload).await
    };

    if let Ok(_) = &result {
        log::info!("Successfully updated asset (ID = {:?})", id);
    } else {
        log::error!("Failed to update asset: {:?}", result);
    }

    match result {
        Ok(_) => Ok(true),
        Err(e) => Err(e),
    }
}
