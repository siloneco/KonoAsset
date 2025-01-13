use std::{hash::Hash, path::PathBuf};

use serde::{de::DeserializeOwned, Serialize};
use uuid::Uuid;

use crate::{
    definitions::traits::AssetTrait,
    file::modify_guard::{self, DeletionGuard},
    loader::HashSetVersionedLoader,
};

use super::{json_store::JsonStore, provider::StoreProvider};

pub async fn delete_asset(provider: &StoreProvider, id: Uuid) -> Result<(), String> {
    let app_dir = provider.data_dir();

    let result = delete_asset_from_store(&app_dir, &provider.get_avatar_store(), id).await;
    if result.is_err() {
        return Err(result.err().unwrap());
    }
    if result.unwrap() {
        return Ok(());
    }

    let result = delete_asset_from_store(&app_dir, &provider.get_avatar_wearable_store(), id).await;
    if result.is_err() {
        return Err(result.err().unwrap());
    }
    if result.unwrap() {
        return Ok(());
    }

    let result = delete_asset_from_store(&app_dir, &provider.get_world_object_store(), id).await;
    if result.is_err() {
        return Err(result.err().unwrap());
    }
    if result.unwrap() {
        return Ok(());
    }

    Err("Asset not found".into())
}

async fn delete_asset_from_store<
    T: AssetTrait + HashSetVersionedLoader<T> + Clone + Serialize + DeserializeOwned + Eq + Hash,
>(
    app_dir: &PathBuf,
    store: &JsonStore<T>,
    id: Uuid,
) -> Result<bool, String> {
    let asset = store.get_asset(id).await;
    if asset.is_none() {
        return Ok(false);
    }
    let asset = asset.unwrap();

    let result = store.delete_asset_and_save(id).await;

    if result.is_err() {
        return Err(result.err().unwrap());
    }

    let result = result.unwrap();

    if !result {
        return Ok(false);
    }

    let path = app_dir.join("data").join(id.to_string());
    let dir_delete_result =
        modify_guard::delete_recursive(&path, DeletionGuard::new(app_dir.clone()));

    if let Err(e) = dir_delete_result {
        return Err(format!("Failed to delete asset directory: {:?}", e));
    }

    let image = &asset.get_description().image_filename;

    if image.is_none() {
        return Ok(true);
    }

    let image_path = app_dir.join("images").join(image.as_ref().unwrap());

    // 画像削除をしてそのまま結果を返す
    delete_asset_image(app_dir, &image_path)
}

pub fn delete_asset_image(app_dir: &PathBuf, image_path: &PathBuf) -> Result<bool, String> {
    if !image_path.exists() {
        return Ok(false);
    }

    let images_dir_path = app_dir.join("images");
    let image_delete_result =
        modify_guard::delete_single_file(&image_path, DeletionGuard::new(images_dir_path.clone()));

    if let Err(e) = image_delete_result {
        return Err(format!("Failed to delete image file: {:?}", e));
    }

    Ok(true)
}

pub fn delete_temporary_images(app_dir: &PathBuf) -> Result<(), String> {
    let images_dir_path = app_dir.join("images");

    if !images_dir_path.exists() {
        return Ok(());
    }

    let entries = std::fs::read_dir(&images_dir_path);
    if let Err(e) = entries {
        return Err(format!("Failed to read images directory: {:?}", e));
    }

    for entry in entries.unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();

        if !path.is_file() {
            continue;
        }

        let file_name = path.file_name().unwrap().to_str().unwrap();
        if !file_name.starts_with("temp_") {
            continue;
        }

        let delete_result =
            modify_guard::delete_single_file(&path, DeletionGuard::new(images_dir_path.clone()));

        if let Err(e) = delete_result {
            return Err(format!("Failed to delete temp image: {:?}", e));
        }
    }

    Ok(())
}
