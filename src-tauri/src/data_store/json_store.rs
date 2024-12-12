use std::{collections::HashSet, fs::File, hash::Hash, path::PathBuf, sync::Mutex};

use serde::{de::DeserializeOwned, Serialize};
use uuid::Uuid;

use crate::definitions::traits::AssetTrait;

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

    pub fn delete_asset_and_save(&self, id: Uuid) -> Result<(), String> {
        let mut assets = self.assets.lock().unwrap();
        let asset = assets.iter().find(|asset| asset.get_id() == id).cloned();

        if asset.is_none() {
            return Ok(());
        }

        assets.remove(&asset.unwrap());

        let mut path = self.app_data_dir.clone();
        path.push("metadata");
        path.push(T::filename());

        let file_open_result = File::create(path);
        // serde_json::to_writer(file, &*assets).unwrap();

        // true

        if file_open_result.is_err() {
            return Err("Failed to open file".into());
        }

        let result = serde_json::to_writer(file_open_result.unwrap(), &*assets);

        match result {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to serialize file: {}", e)),
        }
    }
}
