use std::{fs, path::PathBuf};

use uuid::Uuid;

use crate::{
    data_store::provider::StoreProvider,
    definitions::{
        entities::{AvatarAsset, AvatarRelatedAsset, WorldAsset},
        import_request::{
            AvatarAssetImportRequest, AvatarAssetImportResult, AvatarRelatedAssetImportRequest,
            AvatarRelatedAssetImportResult, WorldAssetImportRequest, WorldAssetImportResult,
        },
    },
    fetcher::image_saver,
};

use super::fileutils;

pub fn import_avatar_asset(
    basic_store: &StoreProvider,
    request: AvatarAssetImportRequest,
) -> AvatarAssetImportResult {
    let mut image_cache_dest = basic_store.app_data_dir();
    image_cache_dest.push("images");
    image_cache_dest.push(format!("{}.jpg", Uuid::new_v4().to_string()));

    let image_save_result = save_image_if_external_url_specified(
        &request.pre_asset.description.image_src,
        &image_cache_dest,
    );

    if image_save_result.is_err() {
        return AvatarAssetImportResult {
            success: false,
            asset: None,
            error_message: Some(image_save_result.err().unwrap()),
        };
    }

    let request = if image_save_result.unwrap() {
        let mut new_request = request.clone();
        new_request.pre_asset.description.image_src =
            image_cache_dest.to_str().unwrap().to_string();

        new_request
    } else {
        request
    };

    let asset = AvatarAsset::create(request.pre_asset.description);
    let result = basic_store
        .get_avatar_store()
        .add_asset_and_save(asset.clone());

    if result.is_err() {
        return AvatarAssetImportResult {
            success: false,
            asset: None,
            error_message: Some(result.err().unwrap().to_string()),
        };
    }

    let src_import_asset_path: PathBuf = PathBuf::from(request.file_or_dir_absolute_path);
    let mut destination = basic_store.app_data_dir();

    destination.push("data");
    destination.push(asset.id.to_string());

    let result = copy_assets(&src_import_asset_path, &destination);

    if result.is_err() {
        let delete_asset_result = basic_store
            .get_avatar_store()
            .delete_asset_and_save(asset.id);

        return AvatarAssetImportResult {
            success: false,
            asset: None,
            error_message: Some(match delete_asset_result {
                Ok(_) => format!("Failed to import asset: {}", result.err().unwrap()),
                Err(e) => format!(
                    "Failed to import asset and also rollback failed: {}, {}",
                    result.err().unwrap(),
                    e
                ),
            }),
        };
    }

    AvatarAssetImportResult {
        success: true,
        asset: Some(asset),
        error_message: None,
    }
}

pub fn import_avatar_related_asset(
    basic_store: &StoreProvider,
    request: AvatarRelatedAssetImportRequest,
) -> AvatarRelatedAssetImportResult {
    let mut image_cache_dest = basic_store.app_data_dir();
    image_cache_dest.push("images");
    image_cache_dest.push(format!("{}.jpg", Uuid::new_v4().to_string()));

    let image_save_result = save_image_if_external_url_specified(
        &request.pre_asset.description.image_src,
        &image_cache_dest,
    );

    if image_save_result.is_err() {
        return AvatarRelatedAssetImportResult {
            success: false,
            asset: None,
            error_message: Some(image_save_result.err().unwrap()),
        };
    }

    let request = if image_save_result.unwrap() {
        let mut new_request = request.clone();
        new_request.pre_asset.description.image_src =
            image_cache_dest.to_str().unwrap().to_string();

        new_request
    } else {
        request
    };

    let asset = AvatarRelatedAsset::create(
        request.pre_asset.description,
        request.pre_asset.category,
        request.pre_asset.supported_avatars,
    );
    let result = basic_store
        .get_avatar_related_store()
        .add_asset_and_save(asset.clone());

    if result.is_err() {
        return AvatarRelatedAssetImportResult {
            success: false,
            asset: None,
            error_message: Some(result.err().unwrap().to_string()),
        };
    }

    let src_import_asset_path: PathBuf = PathBuf::from(request.file_or_dir_absolute_path);
    let mut destination = basic_store.app_data_dir();

    destination.push("data");
    destination.push(asset.id.to_string());

    let result = copy_assets(&src_import_asset_path, &destination);

    if result.is_err() {
        let delete_asset_result = basic_store
            .get_avatar_related_store()
            .delete_asset_and_save(asset.id);

        return AvatarRelatedAssetImportResult {
            success: false,
            asset: None,
            error_message: Some(match delete_asset_result {
                Ok(_) => format!("Failed to import asset: {}", result.err().unwrap()),
                Err(e) => format!(
                    "Failed to import asset and also rollback failed: {}, {}",
                    result.err().unwrap(),
                    e
                ),
            }),
        };
    }

    AvatarRelatedAssetImportResult {
        success: true,
        asset: Some(asset),
        error_message: None,
    }
}

pub fn import_world_asset(
    basic_store: &StoreProvider,
    request: WorldAssetImportRequest,
) -> WorldAssetImportResult {
    let mut image_cache_dest = basic_store.app_data_dir();
    image_cache_dest.push("images");
    image_cache_dest.push(format!("{}.jpg", Uuid::new_v4().to_string()));

    let image_save_result = save_image_if_external_url_specified(
        &request.pre_asset.description.image_src,
        &image_cache_dest,
    );

    if image_save_result.is_err() {
        return WorldAssetImportResult {
            success: false,
            asset: None,
            error_message: Some(image_save_result.err().unwrap()),
        };
    }

    let request = if image_save_result.unwrap() {
        let mut new_request = request.clone();
        new_request.pre_asset.description.image_src =
            image_cache_dest.to_str().unwrap().to_string();

        new_request
    } else {
        request
    };

    let asset = WorldAsset::create(request.pre_asset.description, request.pre_asset.category);
    let result = basic_store
        .get_world_store()
        .add_asset_and_save(asset.clone());

    if result.is_err() {
        return WorldAssetImportResult {
            success: false,
            asset: None,
            error_message: Some(result.err().unwrap().to_string()),
        };
    }

    let src_import_asset_path: PathBuf = PathBuf::from(request.file_or_dir_absolute_path);
    let mut destination = basic_store.app_data_dir();

    destination.push("data");
    destination.push(asset.id.to_string());

    let result = copy_assets(&src_import_asset_path, &destination);

    if result.is_err() {
        let delete_asset_result = basic_store
            .get_world_store()
            .delete_asset_and_save(asset.id);

        return WorldAssetImportResult {
            success: false,
            asset: None,
            error_message: Some(match delete_asset_result {
                Ok(_) => format!("Failed to import asset: {}", result.err().unwrap()),
                Err(e) => format!(
                    "Failed to import asset and also rollback failed: {}, {}",
                    result.err().unwrap(),
                    e
                ),
            }),
        };
    }

    WorldAssetImportResult {
        success: true,
        asset: Some(asset),
        error_message: None,
    }
}

fn copy_assets(src: &PathBuf, dest: &PathBuf) -> Result<(), String> {
    if !dest.exists() {
        let result = fs::create_dir_all(dest);

        if result.is_err() {
            return Err(result.err().unwrap().to_string());
        }
    }

    let result = fileutils::import_asset(src, dest);

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok(())
}

fn save_image_if_external_url_specified(url: &str, dest: &PathBuf) -> Result<bool, String> {
    // URLがファイルパスでファイルが実在するか確認する
    if PathBuf::from(url).exists() {
        return Ok(false);
    }

    let parsed = reqwest::Url::parse(url);
    if parsed.is_err() {
        return Ok(false);
    }

    let result = image_saver::save_image_from_url(url, dest);

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok(true)
}
