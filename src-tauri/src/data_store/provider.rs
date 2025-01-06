use std::{fs, path::PathBuf};

use log::{info, warn};

use crate::definitions::{
    entities::{Avatar, AvatarWearable, WorldObject},
    traits::AssetTrait,
};

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

    pub async fn load_all_assets_from_files(&mut self) -> Result<(), String> {
        backup_metadata(&self.data_dir)?;
        prune_old_backup(&self.data_dir)?;

        match self.avatar_store.load().await {
            Ok(_) => {}
            Err(e) => return Err(e),
        }

        match self.avatar_wearable_store.load().await {
            Ok(_) => {}
            Err(e) => return Err(e),
        }

        match self.world_object_store.load().await {
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
                rename_conflict_dir(&new_metadata_path);
            }

            fs::rename(old_metadata_path, new_metadata_path).unwrap();
        }

        if old_data_path.exists() {
            if new_data_path.exists() {
                rename_conflict_dir(&new_data_path);
            }

            fs::rename(old_data_path, new_data_path).unwrap();
        }

        if old_images_path.exists() {
            if new_images_path.exists() {
                rename_conflict_dir(&new_images_path);
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

fn rename_conflict_dir(path: &PathBuf) {
    let mut new_name = path.clone();

    while new_name.exists() {
        new_name.set_file_name(format!(
            "{}_backup",
            new_name.file_name().unwrap().to_str().unwrap()
        ));
    }

    fs::rename(path, new_name).unwrap();
}

fn backup_metadata(data_dir: &PathBuf) -> Result<(), String> {
    let metadata_path = data_dir.join("metadata");
    let backup_path = metadata_path.join("backups");

    if !metadata_path.exists() {
        return Ok(());
    }

    let dir_name = chrono::Local::now().format("%Y-%m-%d_%H-%M-%S").to_string();
    let backup_path = backup_path.join(dir_name);

    let result = std::fs::create_dir_all(&backup_path);

    if result.is_err() {
        return Err("Failed to create backup directory".into());
    }

    let files = vec![
        Avatar::filename(),
        AvatarWearable::filename(),
        WorldObject::filename(),
    ];

    for file in files {
        let path = metadata_path.join(&file);
        if !path.exists() {
            continue;
        }

        let backup_file = backup_path.join(&file);

        let result = std::fs::copy(&path, &backup_file);

        if result.is_err() {
            warn!("Failed to copy file: {:?}", result.err().unwrap());
        }
    }

    info!("Backup metadata to {:?}", backup_path);

    Ok(())
}

fn prune_old_backup(data_dir: &PathBuf) -> Result<(), String> {
    let backup_path = data_dir.join("metadata/backups");

    if !backup_path.exists() {
        return Ok(());
    }

    let mut entries = Vec::new();

    for entry in std::fs::read_dir(&backup_path).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();

        if !path.is_dir() {
            continue;
        }

        entries.push(path);
    }

    if entries.len() <= 10 {
        return Ok(());
    }

    entries.sort_by(|a, b| {
        let a = a.file_name().unwrap().to_str().unwrap();
        let b = b.file_name().unwrap().to_str().unwrap();

        a.cmp(b)
    });

    let to_remove = entries.len() - 10;

    for i in 0..to_remove {
        let path = &entries[i];

        let result = std::fs::remove_dir_all(path);

        if result.is_err() {
            warn!("Failed to remove backup: {:?}", result.err().unwrap());
        }
    }

    Ok(())
}
