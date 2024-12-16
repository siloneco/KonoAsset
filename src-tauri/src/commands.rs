use std::collections::HashSet;

use tauri::State;
use uuid::Uuid;

use crate::{
    data_store::{provider::StoreProvider, search::text_search},
    definitions::{
        entities::{AvatarAsset, AvatarRelatedAsset, WorldAsset},
        import_request::{
            AvatarAssetImportRequest, AvatarAssetImportResult, AvatarRelatedAssetImportRequest,
            AvatarRelatedAssetImportResult, WorldAssetImportRequest, WorldAssetImportResult,
        },
        results::{DirectoryOpenResult, FetchAssetDescriptionFromBoothResult},
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
pub fn filter_by_text(basic_store: State<'_, StoreProvider>, text: String) -> Vec<Uuid> {
    text_search(&basic_store, &text)
}
