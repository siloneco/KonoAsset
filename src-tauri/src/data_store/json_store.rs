use std::{collections::HashSet, fs::File, hash::Hash, path::PathBuf, sync::Mutex};

use serde::{de::DeserializeOwned, Serialize};
use uuid::Uuid;

use crate::definitions::traits::AssetTrait;

use super::delete::delete_asset_image;

pub struct JsonStore<T: AssetTrait + Clone + Serialize + DeserializeOwned + Eq + Hash> {
    app_data_dir: PathBuf,
    assets: Mutex<HashSet<T>>,
}

impl<T: AssetTrait + Clone + Serialize + DeserializeOwned + Eq + Hash> JsonStore<T> {
    pub fn create(app_data_dir: PathBuf) -> Self {
        let mut path = app_data_dir.clone();
        path.push("metadata");

        if !path.exists() {
            std::fs::create_dir_all(&path).unwrap();
        }

        Self {
            app_data_dir,
            assets: Mutex::new(HashSet::new()),
        }
    }

    pub fn get_assets(&self) -> HashSet<T> {
        self.assets.lock().unwrap().clone()
    }

    pub fn get_asset(&self, id: Uuid) -> Option<T> {
        self.assets
            .lock()
            .unwrap()
            .iter()
            .find(|asset| asset.get_id() == id)
            .cloned()
    }

    pub fn load_assets_from_file(&self) -> Result<(), String> {
        let mut path = self.app_data_dir.clone();
        path.push("metadata");
        path.push(T::filename());

        if !path.exists() {
            return Ok(());
        }

        let file_open_result = File::open(path);

        if file_open_result.is_err() {
            return Err("Failed to open file".into());
        }

        let mut assets = self.assets.lock().unwrap();
        let result: Result<HashSet<T>, serde_json::Error> =
            serde_json::from_reader(file_open_result.unwrap());

        match result {
            Ok(deserialized) => {
                *assets = deserialized;
                Ok(())
            }
            Err(e) => Err(format!("Failed to deserialize file: {}", e)),
        }
    }

    pub fn add_asset_and_save(&self, asset: T) -> Result<(), String> {
        let mut assets = self.assets.lock().unwrap();
        assets.insert(asset.clone());

        let mut path = self.app_data_dir.clone();
        path.push("metadata");
        path.push(T::filename());

        let file_open_result = File::create(path);

        if file_open_result.is_err() {
            return Err("Failed to open file".into());
        }

        let result = serde_json::to_writer(file_open_result.unwrap(), &*assets);

        match result {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to serialize file: {}", e)),
        }
    }

    pub fn update_asset_and_save(&self, mut asset: T) -> Result<(), String> {
        let mut assets = self.assets.lock().unwrap();
        let old_asset = assets
            .iter()
            .find(|a| a.get_id() == asset.get_id())
            .cloned();

        if old_asset.is_none() {
            return Err("Asset not found".into());
        }

        // update の時は created_at を更新しない
        asset.get_description_as_mut().created_at =
            old_asset.as_ref().unwrap().get_description().created_at;

        let old_asset = old_asset.unwrap();

        assets.remove(&old_asset);
        assets.insert(asset.clone());

        if old_asset.get_description().image_src != asset.get_description().image_src {
            let delete_result =
                delete_asset_image(&self.app_data_dir, &old_asset.get_description().image_src);

            if delete_result.is_err() {
                return Err(delete_result.err().unwrap());
            }

            if !delete_result.unwrap() {
                return Err("Failed to delete old image".into());
            }
        }

        let mut path = self.app_data_dir.clone();
        path.push("metadata");
        path.push(T::filename());

        let file_open_result = File::create(path);

        if file_open_result.is_err() {
            return Err("Failed to open file".into());
        }

        let result = serde_json::to_writer(file_open_result.unwrap(), &*assets);

        match result {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to serialize file: {}", e)),
        }
    }

    pub fn delete_asset_and_save(&self, id: Uuid) -> Result<bool, String> {
        let mut assets = self.assets.lock().unwrap();
        let asset = assets.iter().find(|asset| asset.get_id() == id).cloned();

        if asset.is_none() {
            return Ok(false);
        }

        assets.remove(&asset.unwrap());

        let mut path = self.app_data_dir.clone();
        path.push("metadata");
        path.push(T::filename());

        let file_open_result = File::create(path);
        if file_open_result.is_err() {
            return Err("Failed to open file".into());
        }

        let result = serde_json::to_writer(file_open_result.unwrap(), &*assets);

        match result {
            Ok(_) => Ok(true),
            Err(e) => Err(format!("Failed to serialize file: {}", e)),
        }
    }
}
