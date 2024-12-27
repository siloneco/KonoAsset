use std::path::PathBuf;

use crate::definitions::entities::{Avatar, AvatarWearable, WorldObject};

use super::json_store::JsonStore;

pub struct StoreProvider {
    app_data_dir: PathBuf,

    avatar_store: JsonStore<Avatar>,
    avatar_wearable_store: JsonStore<AvatarWearable>,
    world_object_store: JsonStore<WorldObject>,
}

impl StoreProvider {
    pub fn create(app_data_dir: PathBuf) -> Self {
        Self {
            app_data_dir: app_data_dir.clone(),

            avatar_store: JsonStore::create(app_data_dir.clone()),
            avatar_wearable_store: JsonStore::create(app_data_dir.clone()),
            world_object_store: JsonStore::create(app_data_dir.clone()),
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

    pub fn app_data_dir(&self) -> PathBuf {
        self.app_data_dir.clone()
    }
}
