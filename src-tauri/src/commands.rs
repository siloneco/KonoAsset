use std::{collections::HashSet, path::PathBuf};

use tauri::State;
use uuid::Uuid;

use crate::{
    data_store::{
        delete::delete_asset,
        provider::StoreProvider,
        search::{self},
    },
    definitions::{
        entities::{AvatarAsset, AvatarRelatedAsset, FilterRequest, WorldAsset},
        import_request::{
            AvatarAssetImportRequest, AvatarAssetImportResult, AvatarRelatedAssetImportRequest,
            AvatarRelatedAssetImportResult, WorldAssetImportRequest, WorldAssetImportResult,
        },
        results::{
            DirectoryOpenResult, FetchAssetDescriptionFromBoothResult, GetAssetResult, SimpleResult,
        },
    },
    fetcher::booth_fetcher::fetch_asset_details_from_booth,
    importer::import_wrapper::{
        import_avatar_asset, import_avatar_related_asset, import_world_asset,
    },
};

#[tauri::command]
pub fn get_avatar_assets(basic_store: State<'_, StoreProvider>) -> Vec<AvatarAsset> {
    basic_store
        .get_avatar_store()
        .get_assets()
        .iter()
        .cloned()
        .collect()
}

#[tauri::command]
pub fn get_avatar_related_assets(basic_store: State<'_, StoreProvider>) -> Vec<AvatarRelatedAsset> {
    basic_store
        .get_avatar_related_store()
        .get_assets()
        .iter()
        .cloned()
        .collect()
}

#[tauri::command]
pub fn get_world_assets(basic_store: State<'_, StoreProvider>) -> Vec<WorldAsset> {
    basic_store
        .get_world_store()
        .get_assets()
        .iter()
        .cloned()
        .collect()
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
pub fn get_asset_description_from_booth(url: String) -> FetchAssetDescriptionFromBoothResult {
    let result = fetch_asset_details_from_booth(&url);

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
            categories.insert(asset.category.clone());
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
pub fn copy_image_file_to_images(basic_store: State<'_, StoreProvider>, path: String) -> String {
    let path = PathBuf::from(path);
    let mut new_path = basic_store.app_data_dir();
    new_path.push("images");
    new_path.push(format!(
        "{}.{}",
        Uuid::new_v4().to_string(),
        path.extension()
            .unwrap_or(std::ffi::OsStr::new("png"))
            .to_str()
            .unwrap()
    ));

    std::fs::copy(&path, &new_path).unwrap();

    new_path.to_str().unwrap().to_string()
}
