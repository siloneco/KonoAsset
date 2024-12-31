use std::{fs, path::PathBuf};

use uuid::Uuid;

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
    if image_filename.is_some() {
        let images_path = basic_store.data_dir().join("images");
        let new_filename = fix_image(&images_path, image_filename.as_ref().unwrap()).await?;

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

    let src_import_asset_path: PathBuf = PathBuf::from(request.absolute_path);
    let mut destination = basic_store.data_dir();

    destination.push("data");
    destination.push(asset.id.to_string());

    let result = copy_assets(&src_import_asset_path, &destination);

    if result.is_err() {
        let delete_asset_result = basic_store
            .get_avatar_store()
            .delete_asset_and_save(asset.id)
            .await;

        return Err(match delete_asset_result {
            Ok(_) => format!("Failed to import asset: {}", result.err().unwrap()),
            Err(e) => format!(
                "Failed to import asset and also rollback failed: {}, {}",
                result.err().unwrap(),
                e
            ),
        });
    }

    Ok(asset)
}

pub async fn import_avatar_wearable(
    basic_store: &StoreProvider,
    request: AvatarWearableImportRequest,
) -> Result<AvatarWearable, String> {
    let image_filename = &request.pre_asset.description.image_filename;

    let mut request = request.clone();
    if image_filename.is_some() {
        let images_path = basic_store.data_dir().join("images");
        let new_filename = fix_image(&images_path, image_filename.as_ref().unwrap()).await?;

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

    let src_import_asset_path: PathBuf = PathBuf::from(request.absolute_path);
    let mut destination = basic_store.data_dir();

    destination.push("data");
    destination.push(asset.id.to_string());

    let result = copy_assets(&src_import_asset_path, &destination);

    if result.is_err() {
        let delete_asset_result = basic_store
            .get_avatar_wearable_store()
            .delete_asset_and_save(asset.id)
            .await;

        return Err(match delete_asset_result {
            Ok(_) => format!("Failed to import asset: {}", result.err().unwrap()),
            Err(e) => format!(
                "Failed to import asset and also rollback failed: {}, {}",
                result.err().unwrap(),
                e
            ),
        });
    }

    Ok(asset)
}

pub async fn import_world_object(
    basic_store: &StoreProvider,
    request: WorldObjectImportRequest,
) -> Result<WorldObject, String> {
    let image_filename = &request.pre_asset.description.image_filename;

    let mut request = request.clone();
    if image_filename.is_some() {
        let images_path = basic_store.data_dir().join("images");
        let new_filename = fix_image(&images_path, image_filename.as_ref().unwrap()).await?;

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

    let src_import_asset_path: PathBuf = PathBuf::from(request.absolute_path);
    let mut destination = basic_store.data_dir();

    destination.push("data");
    destination.push(asset.id.to_string());

    let result = copy_assets(&src_import_asset_path, &destination);

    if result.is_err() {
        let delete_asset_result = basic_store
            .get_world_object_store()
            .delete_asset_and_save(asset.id)
            .await;

        return Err(match delete_asset_result {
            Ok(_) => format!("Failed to import asset: {}", result.err().unwrap()),
            Err(e) => format!(
                "Failed to import asset and also rollback failed: {}, {}",
                result.err().unwrap(),
                e
            ),
        });
    }

    Ok(asset)
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

async fn fix_image(images_path: &PathBuf, old: &str) -> Result<String, String> {
    let temp_image_path = images_path.clone().join(old);
    let extension = temp_image_path.extension().unwrap().to_str().unwrap();
    let new_image_path =
        images_path
            .clone()
            .join(format!("{}.{}", Uuid::new_v4().to_string(), extension));

    let image_fixation_result =
        execute_image_fixation(temp_image_path.to_str().unwrap(), &new_image_path).await;

    if image_fixation_result.is_err() {
        return Err(format!(
            "Failed to import avatar: {}",
            image_fixation_result.err().unwrap()
        ));
    }

    if image_fixation_result.unwrap() {
        return Ok(new_image_path
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string());
    }

    Ok(old.to_string())
}
