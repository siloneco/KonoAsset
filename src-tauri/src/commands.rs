use std::{
    collections::{HashMap, HashSet},
    fs,
    path::PathBuf,
};

use tauri::{async_runtime::Mutex, State};
use uuid::Uuid;

use crate::{
    booth::fetcher::BoothFetcher,
    data_store::{
        delete::delete_asset,
        provider::StoreProvider,
        search::{self},
    },
    definitions::{
        entities::{AssetSummary, Avatar, AvatarWearable, FilterRequest, SortBy, WorldObject},
        import_request::{
            AvatarImportRequest, AvatarWearableImportRequest, WorldObjectImportRequest,
        },
        results::{BoothInfo, GetAssetResult},
    },
    importer::import_wrapper::{import_avatar, import_avatar_wearable, import_world_object},
    updater::update_handler::UpdateHandler,
};

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

#[tauri::command]
#[specta::specta]
pub async fn open_in_file_manager(
    basic_store: State<'_, Mutex<StoreProvider>>,
    id: String,
) -> Result<bool, String> {
    let mut path = basic_store.lock().await.app_data_dir();
    path.push("data");
    path.push(id);

    if !path.exists() {
        return Err("Directory does not exist".into());
    }

    if !path.is_dir() {
        return Err("Path is not a directory".into());
    }

    let result = opener::open(path);

    match result {
        Ok(_) => Ok(true),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_asset_description_from_booth(
    basic_store: State<'_, Mutex<StoreProvider>>,
    booth_fetcher: State<'_, Mutex<BoothFetcher>>,
    booth_item_id: u64,
) -> Result<BoothInfo, String> {
    let mut images_dir = basic_store.lock().await.app_data_dir();
    images_dir.push("images");

    let result = {
        let mut fetcher = booth_fetcher.lock().await;
        fetcher.fetch(booth_item_id, images_dir).await
    };

    match result {
        Ok((asset_description, estimated_asset_type)) => Ok(BoothInfo {
            description: asset_description,
            estimated_asset_type,
        }),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_asset_tags(
    basic_store: State<'_, Mutex<StoreProvider>>,
) -> Result<Vec<String>, String> {
    let basic_store = basic_store.lock().await;
    let mut tags: HashSet<String> = HashSet::new();

    basic_store
        .get_avatar_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            asset.description.tags.iter().for_each(|tag| {
                tags.insert(tag.clone());
            });
        });

    basic_store
        .get_avatar_wearable_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            asset.description.tags.iter().for_each(|tag| {
                tags.insert(tag.clone());
            });
        });

    basic_store
        .get_world_object_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            asset.description.tags.iter().for_each(|tag| {
                tags.insert(tag.clone());
            });
        });

    Ok(tags.into_iter().collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_supported_avatar_values(
    basic_store: State<'_, Mutex<StoreProvider>>,
) -> Result<Vec<String>, String> {
    let mut values: HashSet<String> = HashSet::new();

    basic_store
        .lock()
        .await
        .get_avatar_wearable_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            asset.supported_avatars.iter().for_each(|val| {
                values.insert(val.clone());
            });
        });

    Ok(values.into_iter().collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_avatar_wearable_categories(
    basic_store: State<'_, Mutex<StoreProvider>>,
) -> Result<Vec<String>, String> {
    let mut categories: HashSet<String> = HashSet::new();

    basic_store
        .lock()
        .await
        .get_avatar_wearable_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            let val = asset.category.clone();
            let val = val.trim();
            if val.is_empty() {
                return;
            }
            categories.insert(val.to_string());
        });

    Ok(categories.into_iter().collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_world_object_categories(
    basic_store: State<'_, Mutex<StoreProvider>>,
) -> Result<Vec<String>, String> {
    let mut categories: HashSet<String> = HashSet::new();

    basic_store
        .lock()
        .await
        .get_world_object_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            let val = asset.category.clone();
            let val = val.trim();
            if val.is_empty() {
                return;
            }
            categories.insert(val.to_string());
        });

    Ok(categories.into_iter().collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_avatar_wearable_supported_avatars(
    basic_store: State<'_, Mutex<StoreProvider>>,
) -> Result<Vec<String>, String> {
    let mut supported_avatars: HashSet<String> = HashSet::new();

    basic_store
        .lock()
        .await
        .get_avatar_wearable_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            asset.supported_avatars.iter().for_each(|val| {
                supported_avatars.insert(val.clone());
            });
        });

    Ok(supported_avatars.into_iter().collect())
}

#[tauri::command]
#[specta::specta]
pub async fn request_asset_deletion(
    basic_store: State<'_, Mutex<StoreProvider>>,
    id: Uuid,
) -> Result<bool, String> {
    let basic_store = basic_store.lock().await;
    delete_asset(&basic_store, id).await
}

#[tauri::command]
#[specta::specta]
pub async fn get_filtered_asset_ids(
    basic_store: State<'_, Mutex<StoreProvider>>,
    request: FilterRequest,
) -> Result<Vec<Uuid>, String> {
    let basic_store = basic_store.lock().await;
    Ok(search::filter(&basic_store, &request).await)
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

#[tauri::command]
#[specta::specta]
pub async fn copy_image_file_to_images(
    basic_store: State<'_, Mutex<StoreProvider>>,
    path: String,
    temporary: bool,
) -> Result<String, String> {
    let path = PathBuf::from(path);
    let mut new_path = basic_store.lock().await.app_data_dir();
    new_path.push("images");

    let filename = if temporary {
        format!(
            "temp_{}.{}",
            Uuid::new_v4().to_string(),
            path.extension()
                .unwrap_or(std::ffi::OsStr::new("png"))
                .to_str()
                .unwrap()
        )
    } else {
        format!(
            "{}.{}",
            Uuid::new_v4().to_string(),
            path.extension()
                .unwrap_or(std::ffi::OsStr::new("png"))
                .to_str()
                .unwrap()
        )
    };

    new_path.push(filename);

    fs::copy(&path, &new_path).unwrap();

    Ok(new_path.to_str().unwrap().to_string())
}

#[tauri::command]
#[specta::specta]
pub async fn check_for_update(update_handler: State<'_, UpdateHandler>) -> Result<bool, String> {
    if !update_handler.is_initialized() {
        return Err(format!("Update handler is not initialized yet."));
    }

    if !update_handler.show_notification().await {
        return Ok(false);
    }

    let new_version_available = update_handler.update_available();
    Ok(new_version_available)
}

#[tauri::command]
#[specta::specta]
pub async fn execute_update(update_handler: State<'_, UpdateHandler>) -> Result<bool, String> {
    if !update_handler.is_initialized() {
        return Err("Update handler is not initialized yet.".into());
    }

    if !update_handler.update_available() {
        return Err("No update available.".into());
    }

    let result = update_handler.execute_update().await;

    match result {
        Ok(_) => Ok(true),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn do_not_notify_update(
    update_handler: State<'_, UpdateHandler>,
) -> Result<bool, String> {
    if !update_handler.is_initialized() {
        return Err("Update handler is not initialized yet.".into());
    }

    update_handler.set_show_notification(false).await;
    Ok(true)
}
