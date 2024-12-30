use std::{collections::HashSet, fs::File, hash::Hash, path::PathBuf};

use serde::{de::DeserializeOwned, Serialize};
use tauri::async_runtime::Mutex;
use uuid::Uuid;

use crate::{definitions::traits::AssetTrait, importer::execute_image_fixation};

use super::delete::delete_asset_image;

pub struct JsonStore<T: AssetTrait + Clone + Serialize + DeserializeOwned + Eq + Hash> {
    data_dir: PathBuf,
    assets: Mutex<HashSet<T>>,
}

impl<T: AssetTrait + Clone + Serialize + DeserializeOwned + Eq + Hash> JsonStore<T> {
    pub fn create(data_dir: PathBuf) -> Self {
        let mut path = data_dir.clone();
        path.push("metadata");

        if !path.exists() {
            std::fs::create_dir_all(&path).unwrap();
        }

        Self {
            data_dir,
            assets: Mutex::new(HashSet::new()),
        }
    }

    pub async fn get_all(&self) -> HashSet<T> {
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
        let mut path = self.data_dir.clone();
        path.push("metadata");
        path.push(T::filename());

        if !path.exists() {
            return Ok(());
        }

        let file_open_result = File::open(path);

        if file_open_result.is_err() {
            return Err("Failed to open file".into());
        }

        let trigger_save;

        {
            let mut assets = self.assets.lock().await;
            let result: Result<HashSet<T>, serde_json::Error> =
                serde_json::from_reader(file_open_result.unwrap());

            if result.is_err() {
                return Err("Failed to deserialize file".into());
            }

            *assets = result.unwrap();

            let (save_required, new_assets) = Self::migrate_to_image_filename_field(&mut assets)
                .map_err(|e| format!("Failed to migrate: {}", e))?;

            if save_required {
                *assets = new_assets;
            }

            trigger_save = save_required;
        }

        if trigger_save {
            self.save().await?;
        }

        Ok(())
    }

    fn migrate_to_image_filename_field(
        items: &mut HashSet<T>,
    ) -> Result<(bool, HashSet<T>), String> {
        let mut save_required = false;
        let mut new_items = HashSet::new();

        for item in items.iter() {
            let mut item = item.clone();
            let old_image_field = item.get_description().image_path.clone();

            if old_image_field.is_none() {
                new_items.insert(item);
                continue;
            }

            let old_image_field = old_image_field.unwrap();

            let path = PathBuf::from(&old_image_field);
            let new_image_field = path.file_name().unwrap().to_str().unwrap().to_string();

            save_required = true;
            item.get_description_as_mut().image_filename = Some(new_image_field);

            new_items.insert(item);
        }

        Ok((save_required, new_items))
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

            if old_asset.get_description().image_path != asset.get_description().image_path {
                let old_image = &old_asset.get_description().image_path;
                let new_image = &asset.get_description().image_path;

                if old_image.is_some() {
                    let delete_result =
                        delete_asset_image(&self.data_dir, old_image.as_ref().unwrap());

                    if delete_result.is_err() {
                        return Err(delete_result.err().unwrap());
                    }

                    if !delete_result.unwrap() {
                        return Err("Failed to delete old image".into());
                    }
                }

                if new_image.is_some() {
                    let mut path = self.data_dir.clone();
                    path.push("images");
                    path.push(format!("{}.jpg", Uuid::new_v4().to_string()));

                    let result = execute_image_fixation(new_image.as_ref().unwrap(), &path).await;

                    if result.is_err() {
                        return Err(result.err().unwrap());
                    }

                    if result.unwrap() {
                        asset.get_description_as_mut().image_path =
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
        let mut path = self.data_dir.clone();
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
