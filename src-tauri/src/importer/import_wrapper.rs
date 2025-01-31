use std::{path::PathBuf, sync::Mutex};

use tauri::AppHandle;
use tauri_specta::Event;

use crate::{
    data_store::provider::StoreProvider,
    definitions::{
        entities::{Avatar, AvatarWearable, ImportProgress, WorldObject},
        import_request::{
            AvatarImportRequest, AvatarWearableImportRequest, WorldObjectImportRequest,
        },
    },
    file::cleanup::DeleteDirOnDrop,
};

use super::fileutils::{self, execute_image_fixation};

pub async fn import_avatar(
    basic_store: &StoreProvider,
    request: AvatarImportRequest,
    app_handle: &AppHandle,
) -> Result<Avatar, String> {
    let image_filename = &request.pre_asset.description.image_filename;

    let mut request = request.clone();
    if let Some(image_filename) = image_filename {
        let images_path = basic_store.data_dir().join("images");
        let new_filename = fix_image(&images_path, image_filename).await?;

        request.pre_asset.description.image_filename = Some(new_filename);
    }

    let asset = Avatar::create(request.pre_asset.description);

    for i in 0..request.absolute_paths.len() {
        let path_str = request.absolute_paths.get(i).unwrap();

        let src_import_asset_path: PathBuf = PathBuf::from(path_str);
        let mut destination = basic_store.data_dir();

        destination.push("data");
        destination.push(asset.id.to_string());

        let last_updated = Mutex::new(0);

        let progress_callback = |progress, filename| {
            let current_timestamp = chrono::Utc::now().timestamp_millis();
            let mut last_updated = last_updated.lock().unwrap();
            if progress == 1.0 || *last_updated + 100 < current_timestamp {
                *last_updated = current_timestamp;

                let total_progress =
                    ((i + 1) as f32) / (request.absolute_paths.len() as f32) * progress;
                ImportProgress::new(total_progress, filename)
                    .emit(app_handle)
                    .unwrap();
            }
        };

        let result = import_files(
            &src_import_asset_path,
            &destination,
            request.delete_source,
            progress_callback,
        )
        .await;

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

        progress_callback(1f32, "".into());
    }

    let result = basic_store
        .get_avatar_store()
        .add_asset_and_save(asset.clone())
        .await;

    if let Err(err) = result {
        return Err(format!("Failed to import avatar: {}", err));
    }

    Ok(asset)
}

pub async fn import_avatar_wearable(
    basic_store: &StoreProvider,
    request: AvatarWearableImportRequest,
    app_handle: &AppHandle,
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

    for i in 0..request.absolute_paths.len() {
        let path_str = request.absolute_paths.get(i).unwrap();

        let src_import_asset_path: PathBuf = PathBuf::from(path_str);
        let mut destination = basic_store.data_dir();

        destination.push("data");
        destination.push(asset.id.to_string());

        let last_updated = Mutex::new(0);

        let progress_callback = |progress, filename| {
            let current_timestamp = chrono::Utc::now().timestamp_millis();
            let mut last_updated = last_updated.lock().unwrap();
            if progress == 1.0 || *last_updated + 100 < current_timestamp {
                *last_updated = current_timestamp;

                let total_progress =
                    ((i + 1) as f32) / (request.absolute_paths.len() as f32) * progress;
                ImportProgress::new(total_progress, filename)
                    .emit(app_handle)
                    .unwrap();
            }
        };

        let result = import_files(
            &src_import_asset_path,
            &destination,
            request.delete_source,
            progress_callback,
        )
        .await;

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

        progress_callback(1f32, "".into());
    }

    let result = basic_store
        .get_avatar_wearable_store()
        .add_asset_and_save(asset.clone())
        .await;

    if let Err(err) = result {
        return Err(format!("Failed to import avatar wearable: {}", err));
    }

    Ok(asset)
}

pub async fn import_world_object(
    basic_store: &StoreProvider,
    request: WorldObjectImportRequest,
    app_handle: &AppHandle,
) -> Result<WorldObject, String> {
    let image_filename = &request.pre_asset.description.image_filename;

    let mut request = request.clone();
    if let Some(image_filename) = image_filename {
        let images_path = basic_store.data_dir().join("images");
        let new_filename = fix_image(&images_path, image_filename).await?;

        request.pre_asset.description.image_filename = Some(new_filename);
    }

    let asset = WorldObject::create(request.pre_asset.description, request.pre_asset.category);

    for i in 0..request.absolute_paths.len() {
        let path_str = request.absolute_paths.get(i).unwrap();

        let src_import_asset_path: PathBuf = PathBuf::from(path_str);
        let mut destination = basic_store.data_dir();

        destination.push("data");
        destination.push(asset.id.to_string());

        let last_updated = Mutex::new(0);

        let progress_callback = |progress, filename| {
            let current_timestamp = chrono::Utc::now().timestamp_millis();
            let mut last_updated = last_updated.lock().unwrap();
            if progress == 1.0 || *last_updated + 100 < current_timestamp {
                *last_updated = current_timestamp;

                let total_progress =
                    ((i + 1) as f32) / (request.absolute_paths.len() as f32) * progress;
                ImportProgress::new(total_progress, filename)
                    .emit(app_handle)
                    .unwrap();
            }
        };

        let result = import_files(
            &src_import_asset_path,
            &destination,
            request.delete_source,
            progress_callback,
        )
        .await;

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

        progress_callback(1f32, "".into());
    }

    let result = basic_store
        .get_world_object_store()
        .add_asset_and_save(asset.clone())
        .await;

    if let Err(err) = result {
        return Err(format!("Failed to import world object: {}", err));
    }

    Ok(asset)
}

async fn import_files(
    src: &PathBuf,
    dest: &PathBuf,
    delete_source: bool,
    progress_callback: impl Fn(f32, String),
) -> Result<(), String> {
    if !dest.exists() {
        std::fs::create_dir_all(dest)
            .map_err(|e| format!("Failed to create directory: {:?}", e))?;
    }

    let mut delete_dir_on_drop = DeleteDirOnDrop::new(dest.clone());

    fileutils::import_asset(src, dest, delete_source, progress_callback)
        .await
        .map_err(|e| format!("Failed to import asset: {:?}", e))?;

    delete_dir_on_drop.mark_as_completed();

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
