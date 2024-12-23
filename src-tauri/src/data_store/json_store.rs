use std::{collections::HashSet, fs::File, hash::Hash, path::PathBuf};

use serde::{de::DeserializeOwned, Serialize};
use tauri::async_runtime::Mutex;
use uuid::Uuid;

use crate::{
    booth::extractor::extract_booth_item_id_from_booth_url, definitions::traits::AssetTrait,
    importer::execute_image_fixation,
};

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

    pub async fn get_assets(&self) -> HashSet<T> {
        self.assets.lock().await.clone()
    }

    pub async fn get_asset(&self, id: Uuid) -> Option<T> {
        self.assets
            .lock()
            .await
            .iter()
            .find(|asset| asset.get_id() == id)
            .cloned()
    }

    pub async fn load_assets_from_file(&self) -> Result<(), String> {
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

        let mut require_save_flag = false;

        {
            let mut assets = self.assets.lock().await;
            let result: Result<HashSet<T>, serde_json::Error> =
                serde_json::from_reader(file_open_result.unwrap());

            if result.is_err() {
                return Err("Failed to deserialize file".into());
            }

            let deserialized = result.unwrap();
            let mut result = HashSet::new();
            deserialized.into_iter().for_each(|mut item| {
                let url = item.get_description().booth_url.as_ref();

                if url.is_some() {
                    let item_id = extract_booth_item_id_from_booth_url(url.unwrap());

                    if item_id.is_ok() {
                        item.get_description_as_mut().booth_item_id = Some(item_id.unwrap());
                        require_save_flag = true;
                    }
                }

                result.insert(item);
            });

            *assets = result;
        }

        if require_save_flag {
            let save_result = self.save().await;

            if save_result.is_err() {
                return Err(save_result.err().unwrap());
            }
        }

        Ok(())
    }

    pub async fn add_asset_and_save(&self, asset: T) -> Result<(), String> {
        {
            let mut assets = self.assets.lock().await;
            assets.insert(asset.clone());
        }

        self.save().await
    }

    pub async fn update_asset_and_save(&self, mut asset: T) -> Result<(), String> {
        {
            let mut assets = self.assets.lock().await;
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

            if old_asset.get_description().image_src != asset.get_description().image_src {
                let old_image = &old_asset.get_description().image_src;
                let new_image = &asset.get_description().image_src;

                if old_image.is_some() {
                    let delete_result =
                        delete_asset_image(&self.app_data_dir, old_image.as_ref().unwrap());

                    if delete_result.is_err() {
                        return Err(delete_result.err().unwrap());
                    }

                    if !delete_result.unwrap() {
                        return Err("Failed to delete old image".into());
                    }
                }

                if new_image.is_some() {
                    let mut path = self.app_data_dir.clone();
                    path.push("images");
                    path.push(format!("{}.jpg", Uuid::new_v4().to_string()));

                    let result = execute_image_fixation(new_image.as_ref().unwrap(), &path).await;

                    if result.is_err() {
                        return Err(result.err().unwrap());
                    }

                    if result.unwrap() {
                        asset.get_description_as_mut().image_src =
                            Some(path.to_str().unwrap().to_string());
                    }
                }
            }

            assets.remove(&old_asset);
            assets.insert(asset.clone());
        }

        let save_result = self.save().await;

        if save_result.is_err() {
            return Err(save_result.err().unwrap());
        }

        Ok(())
    }

    pub async fn delete_asset_and_save(&self, id: Uuid) -> Result<bool, String> {
        {
            let mut assets = self.assets.lock().await;
            let asset = assets.iter().find(|asset| asset.get_id() == id).cloned();

            if asset.is_none() {
                return Ok(false);
            }

            assets.remove(&asset.unwrap());
        }

        let save_result = self.save().await;

        if save_result.is_err() {
            return Err(save_result.err().unwrap());
        }

        Ok(true)
    }

    async fn save(&self) -> Result<(), String> {
        let mut path = self.app_data_dir.clone();
        path.push("metadata");
        path.push(T::filename());

        let file_open_result = File::create(path);

        if file_open_result.is_err() {
            return Err("Failed to open file".into());
        }

        let assets = self.assets.lock().await;
        let result = serde_json::to_writer(file_open_result.unwrap(), &*assets);

        match result {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to serialize file: {}", e)),
        }
    }
}
