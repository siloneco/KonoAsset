use std::{collections::HashSet, path::PathBuf};

use serde::Serialize;
use tauri::AppHandle;
use tauri_specta::Event;
use uuid::Uuid;

use crate::{
    data_store::provider::StoreProvider,
    definitions::{entities::AssetType, traits::AssetTrait},
};

#[derive(Debug, Serialize, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct AssetVolumeStatistics {
    pub id: Uuid,
    pub asset_type: AssetType,
    pub name: String,
    pub size_in_bytes: u64,
}

#[derive(Debug, Serialize, Clone, specta::Type)]
pub enum AssetVolumeEstimatedEventType {
    Chunk,
    Completed,
}

#[derive(Debug, Serialize, Clone, specta::Type, Event)]
#[serde(rename_all = "camelCase")]
pub struct AssetVolumeEstimatedEvent {
    #[serde(rename = "type")]
    pub _type: AssetVolumeEstimatedEventType,
    pub data: Vec<AssetVolumeStatistics>,
}

pub async fn calculate_asset_volumes(
    provider: &StoreProvider,
    app_handle: &AppHandle,
) -> Result<Vec<AssetVolumeStatistics>, String> {
    let data_dir = provider.data_dir().join("data");
    let mut result = Vec::new();

    let avatars = provider.get_avatar_store().get_all().await;
    let wearables = provider.get_avatar_wearable_store().get_all().await;
    let world_objects = provider.get_world_object_store().get_all().await;

    // Calculate volumes for avatars
    let avatar_results =
        calculate_volume_for_assets(&data_dir, app_handle, AssetType::Avatar, &avatars).await?;
    result.extend(avatar_results);

    // Calculate volumes for avatar wearables
    let wearable_results =
        calculate_volume_for_assets(&data_dir, app_handle, AssetType::AvatarWearable, &wearables)
            .await?;
    result.extend(wearable_results);

    // Calculate volumes for world objects
    let world_object_results = calculate_volume_for_assets(
        &data_dir,
        app_handle,
        AssetType::WorldObject,
        &world_objects,
    )
    .await?;
    result.extend(world_object_results);

    // Emit final completed event
    let emit_result = AssetVolumeEstimatedEvent {
        _type: AssetVolumeEstimatedEventType::Completed,
        data: result.clone(),
    }
    .emit(app_handle);

    if let Err(e) = emit_result {
        log::error!("Failed to emit asset volume completed event: {}", e);
    }

    Ok(result)
}

async fn calculate_volume_for_assets<T: AssetTrait>(
    data_dir: &PathBuf,
    app_handle: &AppHandle,
    asset_type: AssetType,
    assets: &HashSet<T>,
) -> Result<Vec<AssetVolumeStatistics>, String> {
    let mut result = Vec::new();

    for entry in assets {
        let asset_path = data_dir.join(entry.get_id().to_string());
        let size = calculate_asset_volume_for_path(asset_path).await?;

        let data = AssetVolumeStatistics {
            id: entry.get_id(),
            asset_type,
            name: entry.get_description().name.clone(),
            size_in_bytes: size,
        };

        result.push(data.clone());

        let emit_result = AssetVolumeEstimatedEvent {
            _type: AssetVolumeEstimatedEventType::Chunk,
            data: vec![data],
        }
        .emit(app_handle);

        if let Err(e) = emit_result {
            log::error!("Failed to emit asset volume estimated event: {}", e);
        }
    }

    Ok(result)
}

async fn calculate_asset_volume_for_path(path: PathBuf) -> Result<u64, String> {
    let mut total_size = 0;

    if let Ok(mut entries) = tokio::fs::read_dir(path).await {
        while let Ok(entry) = entries.next_entry().await {
            if entry.is_none() {
                break;
            }

            let entry = entry.unwrap();
            let path = entry.path();

            if path.is_file() {
                if let Ok(metadata) = path.metadata() {
                    total_size += metadata.len();
                }
            } else if path.is_dir() {
                total_size += Box::pin(calculate_asset_volume_for_path(path)).await?;
            }
        }
    }

    Ok(total_size)
}
