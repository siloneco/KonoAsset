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
};

use super::fileutils::{self, execute_image_fixation};

pub async fn import_avatar_asset(
    basic_store: &StoreProvider,
    request: AvatarAssetImportRequest,
) -> AvatarAssetImportResult {
    let image = &request.pre_asset.description.image_src;

    let mut request = request.clone();
    if image.is_some() {
        let mut new_image_path = basic_store.app_data_dir();
        new_image_path.push("images");
        new_image_path.push(format!("{}.jpg", Uuid::new_v4().to_string()));

        let image_fixation_result =
            execute_image_fixation(image.as_ref().unwrap(), &new_image_path).await;

        if let Err(error) = image_fixation_result {
            return AvatarAssetImportResult {
                success: false,
                asset: None,
                error_message: Some(error),
            };
        }

        if image_fixation_result.unwrap() {
            request.pre_asset.description.image_src =
                Some(new_image_path.to_str().unwrap().to_string());
        }
    }

    let asset = AvatarAsset::create(request.pre_asset.description);
    let result = basic_store
        .get_avatar_store()
        .add_asset_and_save(asset.clone())
        .await;

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
            .delete_asset_and_save(asset.id)
            .await;

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

pub async fn import_avatar_related_asset(
    basic_store: &StoreProvider,
    request: AvatarRelatedAssetImportRequest,
) -> AvatarRelatedAssetImportResult {
    let image = &request.pre_asset.description.image_src;

    let mut request = request.clone();
    if image.is_some() {
        let mut new_image_path = basic_store.app_data_dir();
        new_image_path.push("images");
        new_image_path.push(format!("{}.jpg", Uuid::new_v4().to_string()));

        let image_fixation_result =
            execute_image_fixation(image.as_ref().unwrap(), &new_image_path).await;

        if let Err(error) = image_fixation_result {
            return AvatarRelatedAssetImportResult {
                success: false,
                asset: None,
                error_message: Some(error),
            };
        }

        if image_fixation_result.unwrap() {
            request.pre_asset.description.image_src =
                Some(new_image_path.to_str().unwrap().to_string());
        }
    }

    let asset = AvatarRelatedAsset::create(
        request.pre_asset.description,
        request.pre_asset.category,
        request.pre_asset.supported_avatars,
    );
    let result = basic_store
        .get_avatar_related_store()
        .add_asset_and_save(asset.clone())
        .await;

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
            .delete_asset_and_save(asset.id)
            .await;

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

pub async fn import_world_asset(
    basic_store: &StoreProvider,
    request: WorldAssetImportRequest,
) -> WorldAssetImportResult {
    let image = &request.pre_asset.description.image_src;

    let mut request = request.clone();
    if image.is_some() {
        let mut new_image_path = basic_store.app_data_dir();
        new_image_path.push("images");
        new_image_path.push(format!("{}.jpg", Uuid::new_v4().to_string()));

        let image_fixation_result =
            execute_image_fixation(image.as_ref().unwrap(), &new_image_path).await;

        if let Err(error) = image_fixation_result {
            return WorldAssetImportResult {
                success: false,
                asset: None,
                error_message: Some(error),
            };
        }

        if image_fixation_result.unwrap() {
            request.pre_asset.description.image_src =
                Some(new_image_path.to_str().unwrap().to_string());
        }
    }

    let asset = WorldAsset::create(request.pre_asset.description, request.pre_asset.category);
    let result = basic_store
        .get_world_store()
        .add_asset_and_save(asset.clone())
        .await;

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
            .delete_asset_and_save(asset.id)
            .await;

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
