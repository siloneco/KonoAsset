use std::{collections::HashMap, fs, path::PathBuf, sync::Mutex};

use uuid::Uuid;

use crate::definitions::entities::{AssetItem, AssetType};

pub struct BasicStore {
    app_data_dir: PathBuf,
    assets: Mutex<HashMap<AssetType, Vec<AssetItem>>>,
}

impl BasicStore {
    pub fn create(app_data_dir: PathBuf) -> Self {
        let mut path = app_data_dir.clone();
        path.push("metadata");

        if !path.exists() {
            fs::create_dir_all(&path).unwrap();
        }

        Self {
            app_data_dir,
            assets: Mutex::new(HashMap::new()),
        }
    }

    pub fn get_assets(&self, asset_type: AssetType) -> Vec<AssetItem> {
        let mut assets = self.assets.lock().unwrap();
        let assets = assets.entry(asset_type).or_insert_with(|| vec![]);

        assets.clone()
    }

    pub fn load_from_file(&self) {
        let mut path = self.app_data_dir.clone();
        path.push("metadata");

        for asset_type in AssetType::iter() {
            let mut asset_json_path = path.clone();
            asset_json_path.push(asset_type.filename());

            if !asset_json_path.exists() {
                continue;
            }

            let items = load_from_file(asset_json_path);
            let mut assets = self.assets.lock().unwrap();
            assets.insert(asset_type, items);
        }
    }

    pub fn add_asset_and_save(&self, asset_type: AssetType, asset: AssetItem) {
        let mut assets = self.assets.lock().unwrap();
        let assets = assets.entry(asset_type.clone()).or_insert_with(|| vec![]);
        assets.push(asset.clone());

        let mut path = self.app_data_dir.clone();
        path.push("metadata");
        path.push(asset_type.filename());

        write_assets_file(assets, path);
    }

    pub fn delete_asset_and_save(&self, asset_type: AssetType, id: Uuid) -> bool {
        let mut assets = self.assets.lock().unwrap();
        let assets = assets.entry(asset_type.clone()).or_insert_with(|| vec![]);

        let index = assets.iter().position(|x| x.id == id);
        if index.is_none() {
            return false;
        }
        let index = index.unwrap();
        assets.remove(index);

        let mut path = self.app_data_dir.clone();
        path.push("metadata");
        path.push(asset_type.filename());

        write_assets_file(assets, path);

        true
    }
}

fn write_assets_file(assets: &Vec<AssetItem>, path: PathBuf) {
    let items = serde_json::to_string(assets).unwrap();
    fs::write(path, items).unwrap();
}

fn load_from_file(path: PathBuf) -> Vec<AssetItem> {
    let items = fs::read_to_string(path).unwrap();
    serde_json::from_str(&items).unwrap()
}
