use std::{collections::HashSet, fs::File, hash::Hash, path::PathBuf};

use serde::{de::DeserializeOwned, Serialize};
use tauri::async_runtime::Mutex;
use uuid::Uuid;

use crate::{
    definitions::traits::AssetTrait, importer::execute_image_fixation,
    loader::HashSetVersionedLoader,
};

use super::delete::delete_asset_image;

pub struct JsonStore<
    T: AssetTrait + HashSetVersionedLoader<T> + Clone + Serialize + DeserializeOwned + Eq + Hash,
> {
    data_dir: PathBuf,
    assets: Mutex<HashSet<T>>,
}

impl<
        T: AssetTrait + HashSetVersionedLoader<T> + Clone + Serialize + DeserializeOwned + Eq + Hash,
    > JsonStore<T>
{
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

    pub async fn load(&self) -> Result<(), String> {
        let mut path = self.data_dir.clone();
        path.push("metadata");
        path.push(T::filename());

        if !path.exists() {
            return Ok(());
        }

        let filename = path.file_name().unwrap().to_str().unwrap();

        let file_open_result = File::open(path.clone());

        if file_open_result.is_err() {
            return Err(format!("Failed to open file: {}", filename));
        }

        {
            let mut assets = self.assets.lock().await;
            let result: Result<T::VersionedType, serde_json::Error> =
                serde_json::from_reader(file_open_result.unwrap());

            if result.is_err() {
                return Err(format!(
                    "Failed to deserialize: {:?} ( file: {} )",
                    result.err().unwrap(),
                    filename
                ));
            }

            let result = result.unwrap();

            let data: Result<HashSet<T>, _> = result.try_into();

            if data.is_err() {
                return Err(data.err().unwrap());
            }

            *assets = data.unwrap();
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

            if old_asset.get_description().image_filename != asset.get_description().image_filename
            {
                let images_dir = self.data_dir.clone().join("images");

                let old_image = &old_asset.get_description().image_filename;
                let new_image = &asset.get_description().image_filename;

                if old_image.is_some() {
                    let old_image_path = images_dir.join(old_image.as_ref().unwrap());
                    let delete_result = delete_asset_image(&self.data_dir, &old_image_path);

                    if delete_result.is_err() {
                        return Err(delete_result.err().unwrap());
                    }
                }

                if new_image.is_some() {
                    let temp_new_image = images_dir.join(new_image.as_ref().unwrap());
                    let result = execute_image_fixation(&temp_new_image).await;

                    if result.is_err() {
                        return Err(result.err().unwrap());
                    }

                    let new_image_path = result.unwrap();
                    if let Some(new_image_path) = new_image_path {
                        asset.get_description_as_mut().image_filename = Some(
                            new_image_path
                                .file_name()
                                .unwrap()
                                .to_str()
                                .unwrap()
                                .to_string(),
                        );
                    }
                }
            }

            assets.remove(&old_asset);
            assets.insert(asset.clone());
        }

        self.save().await
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

        let result = self.save().await;

        if result.is_err() {
            return Err(result.err().unwrap());
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

        let data = T::VersionedType::try_from(assets.clone());

        if data.is_err() {
            return Err(data.err().unwrap());
        }

        let result = serde_json::to_writer(file_open_result.unwrap(), &data.unwrap());

        if result.is_err() {
            return Err(format!(
                "Failed to serialize file: {}",
                result.err().unwrap()
            ));
        }

        Ok(())
    }
}
