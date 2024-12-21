use std::{
    collections::{HashMap, HashSet},
    fs,
    path::PathBuf,
};

use tauri::{Result, State};
use uuid::Uuid;

use crate::{
    data_store::{
        delete::delete_asset,
        provider::StoreProvider,
        search::{self},
    },
    definitions::{
        entities::{
            AssetDisplay, AssetType, AvatarAsset, AvatarRelatedAsset, FilterRequest, SortBy,
            WorldAsset,
        },
        import_request::{
            AvatarAssetImportRequest, AvatarAssetImportResult, AvatarRelatedAssetImportRequest,
            AvatarRelatedAssetImportResult, WorldAssetImportRequest, WorldAssetImportResult,
        },
        results::{
            CheckForUpdateResult, DirectoryOpenResult, FetchAssetDescriptionFromBoothResult,
            GetAssetResult, SimpleResult,
        },
    },
    fetcher::booth_fetcher::fetch_asset_details_from_booth,
    importer::import_wrapper::{
        import_avatar_asset, import_avatar_related_asset, import_world_asset,
    },
    updater::update_handler::UpdateHandler,
};

#[tauri::command]
pub fn get_sorted_assets_for_display(
    basic_store: State<'_, StoreProvider>,
    sort_by: SortBy,
) -> Vec<AssetDisplay> {
    let mut created_at_map: HashMap<Uuid, i64> = HashMap::new();
    let mut result: Vec<AssetDisplay> = Vec::new();

    basic_store
        .get_avatar_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            let description = &asset.description;
            result.push(AssetDisplay::create(
                asset.id,
                AssetType::Avatar,
                description.title.clone(),
                description.author.clone(),
                description.image_src.clone(),
                description.booth_url.clone(),
                description.published_at,
            ));

            if sort_by == SortBy::CreatedAt {
                created_at_map.insert(asset.id, description.created_at);
            }
        });

    basic_store
        .get_avatar_related_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            let description = &asset.description;
            result.push(AssetDisplay::create(
                asset.id,
                AssetType::AvatarRelated,
                description.title.clone(),
                description.author.clone(),
                description.image_src.clone(),
                description.booth_url.clone(),
                description.published_at,
            ));

            if sort_by == SortBy::CreatedAt {
                created_at_map.insert(asset.id, description.created_at);
            }
        });

    basic_store
        .get_world_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            let description = &asset.description;
            result.push(AssetDisplay::create(
                asset.id,
                AssetType::World,
                description.title.clone(),
                description.author.clone(),
                description.image_src.clone(),
                description.booth_url.clone(),
                description.published_at,
            ));

            if sort_by == SortBy::CreatedAt {
                created_at_map.insert(asset.id, description.created_at);
            }
        });

    match sort_by {
        SortBy::Title => result.sort_by(|a, b| a.title.cmp(&b.title)),
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

    result
}

#[tauri::command]
pub fn get_asset(basic_store: State<'_, StoreProvider>, id: Uuid) -> GetAssetResult {
    let avatar_asset = basic_store.get_avatar_store().get_asset(id);
    if let Some(avatar_asset) = avatar_asset {
        return GetAssetResult::avatar(avatar_asset);
    }

    let avatar_related_asset = basic_store.get_avatar_related_store().get_asset(id);
    if let Some(avatar_related_asset) = avatar_related_asset {
        return GetAssetResult::avatar_related(avatar_related_asset);
    }

    let world_asset = basic_store.get_world_store().get_asset(id);
    if let Some(world_asset) = world_asset {
        return GetAssetResult::world(world_asset);
    }

    GetAssetResult::error("Asset not found".into())
}

#[tauri::command]
pub fn request_avatar_asset_import(
    basic_store: State<'_, StoreProvider>,
    request: AvatarAssetImportRequest,
) -> AvatarAssetImportResult {
    import_avatar_asset(&basic_store, request)
}

#[tauri::command]
pub fn request_avatar_related_asset_import(
    basic_store: State<'_, StoreProvider>,
    request: AvatarRelatedAssetImportRequest,
) -> AvatarRelatedAssetImportResult {
    import_avatar_related_asset(&basic_store, request)
}

#[tauri::command]
pub fn request_world_asset_import(
    basic_store: State<'_, StoreProvider>,
    request: WorldAssetImportRequest,
) -> WorldAssetImportResult {
    import_world_asset(&basic_store, request)
}

#[tauri::command]
pub fn update_avatar_asset(
    basic_store: State<'_, StoreProvider>,
    asset: AvatarAsset,
) -> SimpleResult {
    let result = basic_store.get_avatar_store().update_asset_and_save(asset);

    match result {
        Ok(_) => SimpleResult::success(),
        Err(e) => SimpleResult::error(e),
    }
}

#[tauri::command]
pub fn update_avatar_related_asset(
    basic_store: State<'_, StoreProvider>,
    asset: AvatarRelatedAsset,
) -> SimpleResult {
    let result = basic_store
        .get_avatar_related_store()
        .update_asset_and_save(asset);

    match result {
        Ok(_) => SimpleResult::success(),
        Err(e) => SimpleResult::error(e),
    }
}

#[tauri::command]
pub fn update_world_asset(
    basic_store: State<'_, StoreProvider>,
    asset: WorldAsset,
) -> SimpleResult {
    let result = basic_store.get_world_store().update_asset_and_save(asset);

    match result {
        Ok(_) => SimpleResult::success(),
        Err(e) => SimpleResult::error(e),
    }
}

#[tauri::command]
pub fn open_in_file_manager(
    basic_store: State<'_, StoreProvider>,
    id: String,
) -> DirectoryOpenResult {
    let mut path = basic_store.app_data_dir();
    path.push("data");
    path.push(id);

    if !path.exists() {
        return DirectoryOpenResult::create(false, Some("Directory does not exist".into()));
    }

    if !path.is_dir() {
        return DirectoryOpenResult::create(false, Some("Path is not a directory".into()));
    }

    let result = opener::open(path);

    match result {
        Ok(_) => DirectoryOpenResult::create(true, None),
        Err(e) => DirectoryOpenResult::create(false, Some(e.to_string())),
    }
}

#[tauri::command]
pub fn get_asset_description_from_booth(
    basic_store: State<'_, StoreProvider>,
    url: String,
) -> FetchAssetDescriptionFromBoothResult {
    let mut images_dir = basic_store.app_data_dir();
    images_dir.push("images");

    let result = fetch_asset_details_from_booth(&url, images_dir);

    match result {
        Ok((asset_description, estimated_asset_type)) => FetchAssetDescriptionFromBoothResult {
            success: true,
            asset_description: Some(asset_description),
            estimated_asset_type,
            error_message: None,
        },
        Err(e) => FetchAssetDescriptionFromBoothResult {
            success: false,
            asset_description: None,
            estimated_asset_type: None,
            error_message: Some(e.to_string()),
        },
    }
}

#[tauri::command]
pub fn get_all_asset_tags(basic_store: State<'_, StoreProvider>) -> Vec<String> {
    let mut tags: HashSet<String> = HashSet::new();

    basic_store
        .get_avatar_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            asset.description.tags.iter().for_each(|tag| {
                tags.insert(tag.clone());
            });
        });

    basic_store
        .get_avatar_related_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            asset.description.tags.iter().for_each(|tag| {
                tags.insert(tag.clone());
            });
        });

    basic_store
        .get_world_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            asset.description.tags.iter().for_each(|tag| {
                tags.insert(tag.clone());
            });
        });

    tags.into_iter().collect()
}

#[tauri::command]
pub fn get_all_supported_avatar_values(basic_store: State<'_, StoreProvider>) -> Vec<String> {
    let mut values: HashSet<String> = HashSet::new();

    basic_store
        .get_avatar_related_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            asset.supported_avatars.iter().for_each(|val| {
                values.insert(val.clone());
            });
        });

    values.into_iter().collect()
}

#[tauri::command]
pub fn get_avatar_related_categories(basic_store: State<'_, StoreProvider>) -> Vec<String> {
    let mut categories: HashSet<String> = HashSet::new();

    basic_store
        .get_avatar_related_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            let val = asset.category.clone();
            let val = val.trim();
            if val.is_empty() {
                return;
            }
            categories.insert(val.to_string());
        });

    categories.into_iter().collect()
}

#[tauri::command]
pub fn get_world_categories(basic_store: State<'_, StoreProvider>) -> Vec<String> {
    let mut categories: HashSet<String> = HashSet::new();

    basic_store
        .get_world_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            let val = asset.category.clone();
            let val = val.trim();
            if val.is_empty() {
                return;
            }
            categories.insert(val.to_string());
        });

    categories.into_iter().collect()
}

#[tauri::command]
pub fn get_avatar_related_supported_avatars(basic_store: State<'_, StoreProvider>) -> Vec<String> {
    let mut supported_avatars: HashSet<String> = HashSet::new();

    basic_store
        .get_avatar_related_store()
        .get_assets()
        .iter()
        .for_each(|asset| {
            asset.supported_avatars.iter().for_each(|val| {
                supported_avatars.insert(val.clone());
            });
        });

    supported_avatars.into_iter().collect()
}

#[tauri::command]
pub fn request_asset_deletion(basic_store: State<'_, StoreProvider>, id: Uuid) -> SimpleResult {
    delete_asset(&basic_store, id)
}

#[tauri::command]
pub fn get_filtered_asset_ids(
    basic_store: State<'_, StoreProvider>,
    request: FilterRequest,
) -> Vec<Uuid> {
    search::filter(&basic_store, &request)
}

#[tauri::command]
pub fn copy_image_file_to_images(
    basic_store: State<'_, StoreProvider>,
    path: String,
    temporary: bool,
) -> String {
    let path = PathBuf::from(path);
    let mut new_path = basic_store.app_data_dir();
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

    new_path.to_str().unwrap().to_string()
}

#[tauri::command]
pub async fn check_for_update(
    update_handler: State<'_, UpdateHandler>,
) -> Result<CheckForUpdateResult> {
    if !update_handler.is_initialized() {
        return Ok(CheckForUpdateResult::create(
            false,
            Some(format!("Update handler is not initialized yet.")),
            false,
            None,
        ));
    }

    if !update_handler.show_notification().await {
        return Ok(CheckForUpdateResult::create(true, None, false, None));
    }

    let available = update_handler.update_available();

    if !available {
        return Ok(CheckForUpdateResult::create(true, None, false, None));
    }

    let version = update_handler.update_version().unwrap();

    Ok(CheckForUpdateResult::create(
        true,
        None,
        available,
        Some(version.to_string()),
    ))
}

#[tauri::command]
pub async fn execute_update(update_handler: State<'_, UpdateHandler>) -> Result<SimpleResult> {
    if !update_handler.is_initialized() {
        return Ok(SimpleResult::error(
            "Update handler is not initialized yet.".into(),
        ));
    }

    if !update_handler.update_available() {
        return Ok(SimpleResult::error("No update available.".into()));
    }

    let result = update_handler.execute_update().await;

    match result {
        Ok(_) => Ok(SimpleResult::success()),
        Err(e) => Ok(SimpleResult::error(e.to_string())),
    }
}

#[tauri::command]
pub async fn do_not_notify_update(
    update_handler: State<'_, UpdateHandler>,
) -> Result<SimpleResult> {
    if !update_handler.is_initialized() {
        return Ok(SimpleResult::error(
            "Update handler is not initialized yet.".into(),
        ));
    }

    update_handler.set_show_notification(false).await;
    Ok(SimpleResult::success())
}
