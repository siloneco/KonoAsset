use std::{fs, path::PathBuf};

use tauri::State;

use crate::{
    data_store::provider::StoreProvider,
    definitions::{
        entities::{AvatarAsset, AvatarRelatedAsset, WorldAsset},
        import_request::{AvatarAssetImportRequest, AvatarAssetImportResult},
        results::{DirectoryOpenResult, FetchAssetDescriptionFromBoothResult},
    },
    fetcher::booth_fetcher::fetch_asset_as_asset_description,
    files::asset_importer,
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
    let asset = AvatarAsset::create(request.pre_asset.description);
    let result = basic_store
        .get_avatar_store()
        .add_asset_and_save(asset.clone());

    let src_import_asset_path = PathBuf::from(request.file_or_dir_absolute_path);
    let mut destination = basic_store.app_data_dir();

    destination.push("data");
    destination.push(asset.id.to_string());

    if !destination.exists() {
        let result = fs::create_dir_all(&destination);

        if result.is_err() {
            return AvatarAssetImportResult {
                success: false,
                avatar_asset: None,
                error_message: Some(result.err().unwrap().to_string()),
            };
        }
    }

    if result.is_err() {
        return AvatarAssetImportResult {
            success: false,
            avatar_asset: None,
            error_message: Some(result.err().unwrap().to_string()),
        };
    }

    let result = asset_importer::import_asset(&src_import_asset_path, &destination);

    if result.is_err() {
        let delete_result = basic_store
            .get_avatar_store()
            .delete_asset_and_save(asset.id);

        if delete_result.is_err() {
            return AvatarAssetImportResult {
                success: false,
                avatar_asset: None,
                error_message: Some(format!(
                    "{}, {}",
                    result.err().unwrap(),
                    delete_result.err().unwrap()
                )),
            };
        }

        return AvatarAssetImportResult {
            success: false,
            avatar_asset: None,
            error_message: Some(result.err().unwrap().to_string()),
        };
    }

    AvatarAssetImportResult {
        success: true,
        avatar_asset: Some(asset),
        error_message: None,
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
    let result = fetch_asset_as_asset_description(&url);

    match result {
        Ok(asset_description) => FetchAssetDescriptionFromBoothResult {
            success: true,
            asset_description: Some(asset_description),
            error_message: None,
        },
        Err(e) => FetchAssetDescriptionFromBoothResult {
            success: false,
            asset_description: None,
            error_message: Some(e.to_string()),
        },
    }
}
