use std::path::PathBuf;

use crate::definitions::entities::{AvatarAsset, AvatarRelatedAsset, WorldAsset};

use super::json_store::JsonStore;

pub struct StoreProvider {
    app_data_dir: PathBuf,

    avatar_store: JsonStore<AvatarAsset>,
    avatar_related_store: JsonStore<AvatarRelatedAsset>,
    world_store: JsonStore<WorldAsset>,
}

impl StoreProvider {
    pub fn create(app_data_dir: PathBuf) -> Self {
        Self {
            app_data_dir: app_data_dir.clone(),

            avatar_store: JsonStore::create(app_data_dir.clone()),
            avatar_related_store: JsonStore::create(app_data_dir.clone()),
            world_store: JsonStore::create(app_data_dir.clone()),
        }
    }

    pub fn load_all_assets_from_files(&self) -> Result<(), String> {
        match self.avatar_store.load_assets_from_file() {
            Ok(_) => {}
            Err(e) => return Err(e),
        }

        match self.avatar_related_store.load_assets_from_file() {
            Ok(_) => {}
            Err(e) => return Err(e),
        }

        match self.world_store.load_assets_from_file() {
            Ok(_) => {}
            Err(e) => return Err(e),
        }

        Ok(())
    }

    pub fn get_avatar_store(&self) -> &JsonStore<AvatarAsset> {
        &self.avatar_store
    }

    pub fn get_avatar_related_store(&self) -> &JsonStore<AvatarRelatedAsset> {
        &self.avatar_related_store
    }

    pub fn get_world_store(&self) -> &JsonStore<WorldAsset> {
        &self.world_store
    }

    pub fn app_data_dir(&self) -> PathBuf {
        self.app_data_dir.clone()
    }
}
