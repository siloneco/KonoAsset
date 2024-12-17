use std::{fs, hash::Hash, path::PathBuf};

use serde::{de::DeserializeOwned, Serialize};
use uuid::Uuid;

use crate::definitions::{results::AssetDeleteResult, traits::AssetTrait};

use super::{json_store::JsonStore, provider::StoreProvider};

pub fn delete_asset(provider: &StoreProvider, id: Uuid) -> AssetDeleteResult {
    let app_dir = provider.app_data_dir();

    let result = delete_asset_from_store(&app_dir, &provider.get_avatar_store(), id);
    if result.is_err() {
        return AssetDeleteResult::error(result.err().unwrap());
    }
    if result.unwrap() {
        return AssetDeleteResult::success();
    }

    let result = delete_asset_from_store(&app_dir, &provider.get_avatar_related_store(), id);
    if result.is_err() {
        return AssetDeleteResult::error(result.err().unwrap());
    }
    if result.unwrap() {
        return AssetDeleteResult::success();
    }

    let result = delete_asset_from_store(&app_dir, &provider.get_world_store(), id);
    if result.is_err() {
        return AssetDeleteResult::error(result.err().unwrap());
    }
    if result.unwrap() {
        return AssetDeleteResult::success();
    }

    AssetDeleteResult::error("Asset not found".into())
}

fn delete_asset_from_store<T: AssetTrait + Clone + Serialize + DeserializeOwned + Eq + Hash>(
    app_dir: &PathBuf,
    store: &JsonStore<T>,
    id: Uuid,
) -> Result<bool, String> {
    let result = store.delete_asset_and_save(id);

    if result.is_err() {
        return Err(result.err().unwrap());
    }

    let result = result.unwrap();

    if !result {
        return Ok(false);
    }

    let mut path = app_dir.clone();
    path.push("data");
    path.push(id.to_string());

    let dir_delete_result = fs::remove_dir_all(path);

    if dir_delete_result.is_err() {
        return Err("Failed to delete asset directory".into());
    }

    Ok(true)
}
