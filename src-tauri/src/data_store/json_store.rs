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

    pub fn load_assets_from_file(&self) {
        let mut path = self.app_data_dir.clone();
        path.push("metadata");
        path.push(T::filename());

        if !path.exists() {
            return;
        }

        let mut assets = self.assets.lock().unwrap();
        *assets = serde_json::from_reader(File::open(path).unwrap()).unwrap();
    }

    pub fn add_asset_and_save(&self, asset: T) {
        let mut assets = self.assets.lock().unwrap();
        assets.insert(asset.clone());

        let mut path = self.app_data_dir.clone();
        path.push("metadata");
        path.push(T::filename());

        let file = File::create(path).unwrap();
        serde_json::to_writer(file, &*assets).unwrap();
    }

    pub fn delete_asset_and_save(&self, id: Uuid) -> bool {
        let mut assets = self.assets.lock().unwrap();
        let asset = assets.iter().find(|asset| asset.get_id() == id).cloned();

        if asset.is_none() {
            return false;
        }

        assets.remove(&asset.unwrap());

        let mut path = self.app_data_dir.clone();
        path.push("metadata");
        path.push(T::filename());

        let file = File::create(path).unwrap();
        serde_json::to_writer(file, &*assets).unwrap();

        true
    }
}
