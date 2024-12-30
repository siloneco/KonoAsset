use std::{fs, path::PathBuf};

use crate::definitions::entities::{Avatar, AvatarWearable, WorldObject};

use super::json_store::JsonStore;

pub struct StoreProvider {
    data_dir: PathBuf,

    avatar_store: JsonStore<Avatar>,
    avatar_wearable_store: JsonStore<AvatarWearable>,
    world_object_store: JsonStore<WorldObject>,
}

impl StoreProvider {
    pub fn create(data_dir: PathBuf) -> Self {
        Self {
            data_dir: data_dir.clone(),

            avatar_store: JsonStore::create(data_dir.clone()),
            avatar_wearable_store: JsonStore::create(data_dir.clone()),
            world_object_store: JsonStore::create(data_dir.clone()),
        }
    }

    pub async fn load_all_assets_from_files(&self) -> Result<(), String> {
        match self.avatar_store.load_assets_from_file().await {
            Ok(_) => {}
            Err(e) => return Err(e),
        }

        match self.avatar_wearable_store.load_assets_from_file().await {
            Ok(_) => {}
            Err(e) => return Err(e),
        }

        match self.world_object_store.load_assets_from_file().await {
            Ok(_) => {}
            Err(e) => return Err(e),
        }

        Ok(())
    }

    pub fn get_avatar_store(&self) -> &JsonStore<Avatar> {
        &self.avatar_store
    }

    pub fn get_avatar_wearable_store(&self) -> &JsonStore<AvatarWearable> {
        &self.avatar_wearable_store
    }

    pub fn get_world_object_store(&self) -> &JsonStore<WorldObject> {
        &self.world_object_store
    }

    pub fn data_dir(&self) -> PathBuf {
        self.data_dir.clone()
    }

    pub async fn migrate_data_dir(&mut self, new_path: &PathBuf) -> Result<(), String> {
        if !new_path.is_dir() {
            return Err("New path is not a directory".into());
        }

        if !new_path.exists() {
            fs::create_dir_all(new_path).unwrap();
        }

        let old_path = &self.data_dir;

        let mut old_metadata_path = old_path.clone();
        let mut new_metadata_path = new_path.clone();

        old_metadata_path.push("metadata");
        new_metadata_path.push("metadata");

        let mut old_data_path = old_path.clone();
        let mut new_data_path = new_path.clone();

        old_data_path.push("data");
        new_data_path.push("data");

        let mut old_images_path = old_path.clone();
        let mut new_images_path = new_path.clone();

        old_images_path.push("images");
        new_images_path.push("images");

        if old_metadata_path.exists() {
            if new_metadata_path.exists() {
                backup(&new_metadata_path);
            }

            fs::rename(old_metadata_path, new_metadata_path).unwrap();
        }

        if old_data_path.exists() {
            if new_data_path.exists() {
                backup(&new_data_path);
            }

            fs::rename(old_data_path, new_data_path).unwrap();
        }

        if old_images_path.exists() {
            if new_images_path.exists() {
                backup(&new_images_path);
            }

            fs::rename(old_images_path, new_images_path).unwrap();
        }

        self.avatar_store = JsonStore::create(new_path.clone());
        self.avatar_wearable_store = JsonStore::create(new_path.clone());
        self.world_object_store = JsonStore::create(new_path.clone());

        self.data_dir = new_path.clone();

        let result = self.load_all_assets_from_files().await;

        if let Err(e) = result {
            return Err(format!("test: {}", e));
        }

        Ok(())
    }
}

fn backup(path: &PathBuf) {
    let mut new_name = path.clone();

    while new_name.exists() {
        new_name.set_file_name(format!(
            "{}_backup",
            new_name.file_name().unwrap().to_str().unwrap()
        ));
    }

    fs::rename(path, new_name).unwrap();
}
