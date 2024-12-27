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
    let image = &request.pre_asset.description.image_path;

    let mut request = request.clone();
    if image.is_some() {
        let mut new_image_path = basic_store.app_data_dir();
        new_image_path.push("images");
        new_image_path.push(format!("{}.jpg", Uuid::new_v4().to_string()));

        let image_fixation_result =
            execute_image_fixation(image.as_ref().unwrap(), &new_image_path).await;

        if image_fixation_result.is_err() {
            return Err(format!(
                "Failed to import avatar: {}",
                image_fixation_result.err().unwrap()
            ));
        }

        if image_fixation_result.unwrap() {
            request.pre_asset.description.image_path =
                Some(new_image_path.to_str().unwrap().to_string());
        }
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
    let mut destination = basic_store.app_data_dir();

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
    let image = &request.pre_asset.description.image_path;

    let mut request = request.clone();
    if image.is_some() {
        let mut new_image_path = basic_store.app_data_dir();
        new_image_path.push("images");
        new_image_path.push(format!("{}.jpg", Uuid::new_v4().to_string()));

        let image_fixation_result =
            execute_image_fixation(image.as_ref().unwrap(), &new_image_path).await;

        if let Err(error) = image_fixation_result {
            return Err(format!("Failed to import avatar wearable: {}", error));
        }

        if image_fixation_result.unwrap() {
            request.pre_asset.description.image_path =
                Some(new_image_path.to_str().unwrap().to_string());
        }
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
    let mut destination = basic_store.app_data_dir();

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
    let image = &request.pre_asset.description.image_path;

    let mut request = request.clone();
    if image.is_some() {
        let mut new_image_path = basic_store.app_data_dir();
        new_image_path.push("images");
        new_image_path.push(format!("{}.jpg", Uuid::new_v4().to_string()));

        let image_fixation_result =
            execute_image_fixation(image.as_ref().unwrap(), &new_image_path).await;

        if let Err(error) = image_fixation_result {
            return Err(format!("Failed to import world object: {}", error));
        }

        if image_fixation_result.unwrap() {
            request.pre_asset.description.image_path =
                Some(new_image_path.to_str().unwrap().to_string());
        }
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
    let mut destination = basic_store.app_data_dir();

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
