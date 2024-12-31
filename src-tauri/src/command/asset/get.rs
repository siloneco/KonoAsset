use std::collections::HashMap;

use tauri::{async_runtime::Mutex, State};
use uuid::Uuid;

use crate::{
    data_store::provider::StoreProvider,
    definitions::{
        entities::{AssetSummary, SortBy},
        results::GetAssetResult,
    },
};

#[tauri::command]
#[specta::specta]
pub async fn get_asset(
    basic_store: State<'_, Mutex<StoreProvider>>,
    id: Uuid,
) -> Result<GetAssetResult, String> {
    let basic_store = basic_store.lock().await;

    let avatar = basic_store.get_avatar_store().get_asset(id).await;
    if let Some(asset) = avatar {
        return Ok(GetAssetResult::avatar(asset));
    }

    let avatar_wearable = basic_store.get_avatar_wearable_store().get_asset(id).await;
    if let Some(asset) = avatar_wearable {
        return Ok(GetAssetResult::avatar_wearable(asset));
    }

    let world_object = basic_store.get_world_object_store().get_asset(id).await;
    if let Some(asset) = world_object {
        return Ok(GetAssetResult::world_object(asset));
    }

    Err("Asset not found".into())
}

#[tauri::command]
#[specta::specta]
pub async fn get_sorted_assets_for_display(
    basic_store: State<'_, Mutex<StoreProvider>>,
    sort_by: SortBy,
) -> Result<Vec<AssetSummary>, String> {
    let mut created_at_map: HashMap<Uuid, i64> = HashMap::new();
    let mut result: Vec<AssetSummary> = Vec::new();

    {
        let basic_store = basic_store.lock().await;

        basic_store
            .get_avatar_store()
            .get_all()
            .await
            .iter()
            .for_each(|asset| {
                let description = &asset.description;
                result.push(AssetSummary::from(asset));

                if sort_by == SortBy::CreatedAt {
                    created_at_map.insert(asset.id, description.created_at);
                }
            });

        basic_store
            .get_avatar_wearable_store()
            .get_all()
            .await
            .iter()
            .for_each(|asset| {
                let description = &asset.description;
                result.push(AssetSummary::from(asset));

                if sort_by == SortBy::CreatedAt {
                    created_at_map.insert(asset.id, description.created_at);
                }
            });

        basic_store
            .get_world_object_store()
            .get_all()
            .await
            .iter()
            .for_each(|asset| {
                let description = &asset.description;
                result.push(AssetSummary::from(asset));

                if sort_by == SortBy::CreatedAt {
                    created_at_map.insert(asset.id, description.created_at);
                }
            });
    }

    match sort_by {
        SortBy::Name => result.sort_by(|a, b| a.name.cmp(&b.name)),
        SortBy::Creator => result.sort_by(|a, b| a.creator.cmp(&b.creator)),
        SortBy::CreatedAt => result.sort_by(|a, b| {
            created_at_map
                .get(&a.id)
                .unwrap()
                .cmp(&created_at_map.get(&b.id).unwrap())
        }),
        SortBy::PublishedAt => result.sort_by(|a, b| {
            a.published_at
                .unwrap_or(0)
                .cmp(&b.published_at.unwrap_or(0))
        }),
    }

    Ok(result)
}

#[tauri::command]
#[specta::specta]
pub async fn get_asset_displays_by_booth_id(
    basic_store: State<'_, Mutex<StoreProvider>>,
    booth_item_id: u64,
) -> Result<Vec<AssetSummary>, String> {
    let basic_store = basic_store.lock().await;
    let mut result = Vec::new();

    basic_store
        .get_avatar_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            if asset.description.booth_item_id == Some(booth_item_id) {
                result.push(AssetSummary::from(asset));
            }
        });

    basic_store
        .get_avatar_wearable_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            if asset.description.booth_item_id == Some(booth_item_id) {
                result.push(AssetSummary::from(asset));
            }
        });

    basic_store
        .get_world_object_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            if asset.description.booth_item_id == Some(booth_item_id) {
                result.push(AssetSummary::from(asset));
            }
        });

    Ok(result)
}
