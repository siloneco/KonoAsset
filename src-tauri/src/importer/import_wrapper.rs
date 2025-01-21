use std::path::PathBuf;

use crate::{
    data_store::provider::StoreProvider,
    definitions::{
        entities::{Avatar, AvatarWearable, WorldObject},
        import_request::{
            AvatarImportRequest, AvatarWearableImportRequest, WorldObjectImportRequest,
        },
    },
};

use super::fileutils::{self, execute_image_fixation};

pub async fn import_avatar(
    basic_store: &StoreProvider,
    request: AvatarImportRequest,
) -> Result<Avatar, String> {
    let image_filename = &request.pre_asset.description.image_filename;

    let mut request = request.clone();
    if let Some(image_filename) = image_filename {
        let images_path = basic_store.data_dir().join("images");
        let new_filename = fix_image(&images_path, image_filename).await?;

        request.pre_asset.description.image_filename = Some(new_filename);
    }

    let asset = Avatar::create(request.pre_asset.description);
    let result = basic_store
        .get_avatar_store()
        .add_asset_and_save(asset.clone())
        .await;

    if let Err(err) = result {
        return Err(format!("Failed to import avatar: {}", err));
    }

    for path_str in request.absolute_paths {
        let src_import_asset_path: PathBuf = PathBuf::from(path_str);
        let mut destination = basic_store.data_dir();

        destination.push("data");
        destination.push(asset.id.to_string());

        let result = import_files(&src_import_asset_path, &destination, request.delete_source);

        if let Err(err) = result {
            let delete_asset_result = basic_store
                .get_avatar_store()
                .delete_asset_and_save(asset.id)
                .await;

            if let Err(delete_err) = delete_asset_result {
                return Err(format!(
                    "Failed to import asset and also rollback failed: {}, {}",
                    err, delete_err
                ));
            }

            return Err(format!("Failed to import asset: {}", err));
        }
    }

    Ok(asset)
}

pub async fn import_avatar_wearable(
    basic_store: &StoreProvider,
    request: AvatarWearableImportRequest,
) -> Result<AvatarWearable, String> {
    let image_filename = &request.pre_asset.description.image_filename;

    let mut request = request.clone();
    if let Some(image_filename) = image_filename {
        let images_path = basic_store.data_dir().join("images");
        let new_filename = fix_image(&images_path, image_filename).await?;

        request.pre_asset.description.image_filename = Some(new_filename);
    }

    let asset = AvatarWearable::create(
        request.pre_asset.description,
        request.pre_asset.category,
        request.pre_asset.supported_avatars,
    );
    let result = basic_store
        .get_avatar_wearable_store()
        .add_asset_and_save(asset.clone())
        .await;

    if let Err(err) = result {
        return Err(format!("Failed to import avatar wearable: {}", err));
    }

    for path_str in request.absolute_paths {
        let src_import_asset_path: PathBuf = PathBuf::from(path_str);
        let mut destination = basic_store.data_dir();

        destination.push("data");
        destination.push(asset.id.to_string());

        let result = import_files(&src_import_asset_path, &destination, request.delete_source);

        if let Err(err) = result {
            let delete_asset_result = basic_store
                .get_avatar_wearable_store()
                .delete_asset_and_save(asset.id)
                .await;

            if let Err(delete_err) = delete_asset_result {
                return Err(format!(
                    "Failed to import asset and also rollback failed: {}, {}",
                    err, delete_err
                ));
            }

            return Err(format!("Failed to import asset: {}", err));
        }
    }

    Ok(asset)
}

pub async fn import_world_object(
    basic_store: &StoreProvider,
    request: WorldObjectImportRequest,
) -> Result<WorldObject, String> {
    let image_filename = &request.pre_asset.description.image_filename;

    let mut request = request.clone();
    if let Some(image_filename) = image_filename {
        let images_path = basic_store.data_dir().join("images");
        let new_filename = fix_image(&images_path, image_filename).await?;

        request.pre_asset.description.image_filename = Some(new_filename);
    }

    let asset = WorldObject::create(request.pre_asset.description, request.pre_asset.category);
    let result = basic_store
        .get_world_object_store()
        .add_asset_and_save(asset.clone())
        .await;

    if let Err(err) = result {
        return Err(format!("Failed to import world object: {}", err));
    }

    for path_str in request.absolute_paths {
        let src_import_asset_path: PathBuf = PathBuf::from(path_str);
        let mut destination = basic_store.data_dir();

        destination.push("data");
        destination.push(asset.id.to_string());

        let result = import_files(&src_import_asset_path, &destination, request.delete_source);
        if let Err(err) = result {
            let delete_asset_result = basic_store
                .get_world_object_store()
                .delete_asset_and_save(asset.id)
                .await;

            if let Err(delete_err) = delete_asset_result {
                return Err(format!(
                    "Failed to import asset and also rollback failed: {}, {}",
                    err, delete_err
                ));
            }

            return Err(format!("Failed to import asset: {}", err));
        }
    }

    Ok(asset)
}

fn import_files(src: &PathBuf, dest: &PathBuf, delete_source: bool) -> Result<(), String> {
    if !dest.exists() {
        std::fs::create_dir_all(dest)
            .map_err(|e| format!("Failed to create directory: {:?}", e))?;
    }

    fileutils::import_asset(src, dest, delete_source)
        .map_err(|e| format!("Failed to import asset: {:?}", e))?;

    Ok(())
}

async fn fix_image(images_path: &PathBuf, temp_path_str: &str) -> Result<String, String> {
    let temp_image_path = images_path.clone().join(temp_path_str);

    let new_image_path = execute_image_fixation(&temp_image_path)
        .await
        .map_err(|e| format!("Failed to import asset: {}", e))?;

    if let Some(new_image_path) = new_image_path {
        let file_name = new_image_path.file_name();

        if file_name.is_none() {
            return Err("Failed to import asset: Image file name is invalid".to_string());
        }

        let file_name = file_name.unwrap().to_str();

        if file_name.is_none() {
            return Err("Failed to import asset: Image file name is invalid".to_string());
        }

        return Ok(file_name.unwrap().to_string());
    }

    log::warn!("Image does not need to be fixed: {}", temp_path_str);
    Ok(temp_path_str.to_string())
}
