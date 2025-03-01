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
    pub fn create(data_dir: &PathBuf) -> Result<Self, String> {
        let path = data_dir.join("metadata");

        if !path.exists() {
            std::fs::create_dir_all(&path)
                .map_err(|e| format!("Failed to create directory at {}: {}", path.display(), e))?;
        }

        Ok(Self {
            data_dir: data_dir.clone(),
            assets: Mutex::new(HashSet::new()),
        })
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
        let filename = T::filename();

        let mut path = self.data_dir.clone();
        path.push("metadata");
        path.push(&filename);

        if !path.exists() {
            return Ok(());
        }

        let file = File::open(path.clone())
            .map_err(|e| format!("Failed to open file at {}: {}", path.display(), e))?;

        {
            let mut assets = self.assets.lock().await;
            let result: T::VersionedType = serde_json::from_reader(file)
                .map_err(|e| format!("Failed to deserialize: {:?} ( file: {} )", e, filename))?;

            let data: HashSet<T> = result.try_into()?;

            *assets = data;
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
            let old_asset = old_asset.unwrap();

            // update の時は created_at を更新しない
            asset.get_description_as_mut().created_at = old_asset.get_description().created_at;

            if old_asset.get_description().image_filename != asset.get_description().image_filename
            {
                let images_dir = self.data_dir.clone().join("images");

                let old_image = &old_asset.get_description().image_filename;
                let new_image = &asset.get_description().image_filename;

                if let Some(old_image_filename) = old_image {
                    delete_asset_image(&self.data_dir, old_image_filename).await?;
                }

                if let Some(new_image_filename) = new_image {
                    let temp_new_image = images_dir.join(new_image_filename);
                    let new_image_path = execute_image_fixation(&temp_new_image).await?;

                    if let Some(new_image_filename) = new_image_path {
                        asset.get_description_as_mut().image_filename = Some(new_image_filename);
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
            let asset = asset.unwrap();

            assets.remove(&asset);
        }

        self.save().await?;

        Ok(true)
    }

    pub async fn merge_from(&self, other: &mut JsonStore<T>) -> Result<(), String> {
        {
            let mut assets = self.assets.lock().await;
            let other_assets = other.assets.lock().await.clone();

            for asset in other_assets {
                assets.insert(asset);
            }
        }

        self.save().await
    }

    async fn save(&self) -> Result<(), String> {
        let path = self.data_dir.join("metadata").join(T::filename());

        let file = File::create(&path)
            .map_err(|e| format!("Failed to create file at {}: {}", path.display(), e))?;

        let data = {
            let assets = self.assets.lock().await;
            T::VersionedType::try_from(assets.clone())?
        };

        let result = serde_json::to_writer(file, &data);

        if let Err(e) = result {
            return Err(format!("Failed to serialize file: {}", e));
        }

        Ok(())
    }
}
