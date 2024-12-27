use std::{fs, hash::Hash, path::PathBuf};

use serde::{de::DeserializeOwned, Serialize};
use uuid::Uuid;

use crate::definitions::traits::AssetTrait;

use super::{json_store::JsonStore, provider::StoreProvider};

pub async fn delete_asset(provider: &StoreProvider, id: Uuid) -> Result<bool, String> {
    let app_dir = provider.app_data_dir();

    let result = delete_asset_from_store(&app_dir, &provider.get_avatar_store(), id).await;
    if result.is_err() {
        return Err(result.err().unwrap());
    }
    if result.unwrap() {
        return Ok(true);
    }

    let result = delete_asset_from_store(&app_dir, &provider.get_avatar_wearable_store(), id).await;
    if result.is_err() {
        return Err(result.err().unwrap());
    }
    if result.unwrap() {
        return Ok(true);
    }

    let result = delete_asset_from_store(&app_dir, &provider.get_world_object_store(), id).await;
    if result.is_err() {
        return Err(result.err().unwrap());
    }
    if result.unwrap() {
        return Ok(true);
    }

    Err("Asset not found".into())
}

async fn delete_asset_from_store<
    T: AssetTrait + Clone + Serialize + DeserializeOwned + Eq + Hash,
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

    // アセット本体削除
    let mut path = app_dir.clone();
    path.push("data");
    path.push(id.to_string());

    let dir_delete_result = fs::remove_dir_all(path);

    if dir_delete_result.is_err() {
        return Err("Failed to delete asset directory".into());
    }

    let image = &asset.get_description().image_path;

    if image.is_none() {
        return Ok(true);
    }

    // 画像削除をしてそのまま結果を返す
    delete_asset_image(app_dir, image.as_ref().unwrap())
}

pub fn delete_asset_image(app_dir: &PathBuf, image_path: &str) -> Result<bool, String> {
    let mut images_dir = app_dir.clone();
    images_dir.push("images");

    let images_path = images_dir.canonicalize();
    if images_path.is_err() {
        return Err(format!(
            "Failed to get images path: {:?}",
            images_path.err()
        ));
    }
    let images_path = images_path.unwrap();

    let path = PathBuf::from(image_path).canonicalize();
    if path.is_err() {
        return Err(format!("Failed to get image path: {:?}", path.err()));
    }
    let path = path.unwrap();

    if !path.starts_with(&images_path) {
        return Err("Invalid image path. Image path must be under app's images directory".into());
    }

    let image_delete_result = fs::remove_file(path);

    if image_delete_result.is_err() {
        return Err("Failed to delete image file".into());
    }

    Ok(true)
}

pub fn delete_temporary_images(app_dir: &PathBuf) -> Result<(), String> {
    let mut images_path = app_dir.clone();
    images_path.push("images");

    let entries = fs::read_dir(&images_path);
    if entries.is_err() {
        return Err(format!(
            "Failed to read images directory: {:?}",
            entries.err()
        ));
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

        let delete_result = fs::remove_file(path);

        if delete_result.is_err() {
            return Err(format!(
                "Failed to delete image file: {:?}",
                delete_result.err()
            ));
        }
    }

    Ok(())
}
