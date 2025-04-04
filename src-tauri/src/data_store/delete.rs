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

    let deleted = delete_asset_from_store(&app_dir, &provider.get_avatar_store(), id).await?
        || delete_asset_from_store(&app_dir, &provider.get_avatar_wearable_store(), id).await?
        || delete_asset_from_store(&app_dir, &provider.get_world_object_store(), id).await?;

    if !deleted {
        return Err("Asset not found".into());
    }

    // すべてのアセットの依存アセットからアイテムを削除
    provider.remove_all_dependencies(id).await?;

    return Ok(());
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

    let result = store
        .delete_asset_and_save(id)
        .await
        .map_err(|e| format!("Failed to delete asset: {:?}", e))?;

    if !result {
        return Ok(false);
    }

    let path = app_dir.join("data").join(id.to_string());
    let dir_delete_result =
        modify_guard::delete_recursive(&path, &DeletionGuard::new(app_dir)).await;

    if let Err(e) = dir_delete_result {
        return Err(format!("Failed to delete asset directory: {:?}", e));
    }

    let image = &asset.get_description().image_filename;

    if image.is_none() {
        return Ok(true);
    }
    let image_filename = image.as_ref().unwrap();

    // 画像削除をしてそのまま結果を返す
    delete_asset_image(app_dir, image_filename).await
}

pub async fn delete_asset_image(app_dir: &PathBuf, filename: &str) -> Result<bool, String> {
    let images_dir_path = app_dir.join("images");
    let image_path = images_dir_path.join(filename);

    log::info!("Image file path: {}", image_path.display());

    if !image_path.exists() {
        return Ok(true);
    }

    let image_delete_result =
        modify_guard::delete_single_file(&image_path, &DeletionGuard::new(&images_dir_path)).await;

    if let Err(e) = image_delete_result {
        return Err(format!("Failed to delete image file: {:?}", e));
    }

    Ok(true)
}

pub async fn delete_temporary_images(app_dir: &PathBuf) -> Result<(), String> {
    let images_dir_path = app_dir.join("images");

    if !images_dir_path.exists() {
        return Ok(());
    }

    let entries = std::fs::read_dir(&images_dir_path)
        .map_err(|e| format!("Failed to read images directory: {:?}", e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {:?}", e))?;
        let path = entry.path();

        if !path.is_file() {
            continue;
        }

        let file_name = path.file_name();

        if file_name.is_none() {
            continue;
        }
        let file_name = file_name.unwrap().to_str();

        if file_name.is_none() {
            continue;
        }
        let file_name = file_name.unwrap();

        if !file_name.starts_with("temp_") {
            continue;
        }

        modify_guard::delete_single_file(&path, &DeletionGuard::new(&images_dir_path))
            .await
            .map_err(|e| format!("Failed to delete temp image: {:?}", e))?;
    }

    Ok(())
}
