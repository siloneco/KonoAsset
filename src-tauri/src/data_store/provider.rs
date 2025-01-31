use std::{ffi::OsStr, fs, path::PathBuf};

use serde::Serialize;

use crate::{
    definitions::{
        entities::{Avatar, AvatarWearable, WorldObject},
        traits::AssetTrait,
    },
    file::{
        cleanup::DeleteDirOnDrop,
        modify_guard::{self, DeletionGuard, FileTransferGuard},
    },
};

use super::json_store::JsonStore;

pub struct StoreProvider {
    data_dir: PathBuf,

    avatar_store: JsonStore<Avatar>,
    avatar_wearable_store: JsonStore<AvatarWearable>,
    world_object_store: JsonStore<WorldObject>,
}

impl StoreProvider {
    pub fn create(data_dir: PathBuf) -> Result<Self, String> {
        let avatar_store: JsonStore<Avatar> = JsonStore::create(data_dir.clone())?;
        let avatar_wearable_store: JsonStore<AvatarWearable> = JsonStore::create(data_dir.clone())?;
        let world_object_store: JsonStore<WorldObject> = JsonStore::create(data_dir.clone())?;

        Ok(Self {
            data_dir: data_dir.clone(),

            avatar_store: avatar_store,
            avatar_wearable_store: avatar_wearable_store,
            world_object_store: world_object_store,
        })
    }

    pub async fn load_all_assets_from_files(&mut self) -> Result<(), String> {
        backup_metadata(&self.data_dir).await?;
        prune_old_backup(&self.data_dir).await?;

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

    pub async fn migrate_data_dir(&mut self, new_path: &PathBuf) -> Result<MigrateResult, String> {
        if !new_path.is_dir() {
            return Err("New path is not a directory".into());
        }

        if !new_path.exists() {
            fs::create_dir_all(new_path)
                .map_err(|e| format!("Failed to create directory: {:?}", e))?;
        }

        let old_path = self.data_dir.clone();

        let old_metadata_path = old_path.join("metadata");
        let new_metadata_path = new_path.join("metadata");

        let old_data_path = old_path.join("data");
        let new_data_path = new_path.join("data");

        let old_images_path = old_path.join("images");
        let new_images_path = new_path.join("images");

        let mut dir_cleanups = Vec::new();

        if old_metadata_path.exists() {
            if new_metadata_path.exists() {
                if let Err(e) = rename_conflict_dir(&new_metadata_path).await {
                    let msg = format!(
                        "Failed to rename and backup conflicted metadata dir: {:?}",
                        e
                    );
                    log::error!("{}", &msg);
                    return Err(msg);
                }
            }

            dir_cleanups.push(DeleteDirOnDrop::new(new_metadata_path.clone()));

            if let Err(e) = modify_guard::copy_dir(
                &old_metadata_path,
                &new_metadata_path,
                false,
                FileTransferGuard::new(Some(old_path.clone()), Some(new_path.clone())),
                |_, _| {},
            )
            .await
            {
                let msg = format!("Failed to copy metadata dir: {:?}", e);
                log::error!("{}", &msg);
                return Err(msg);
            }
        }

        if old_data_path.exists() {
            if new_data_path.exists() {
                if let Err(e) = rename_conflict_dir(&new_data_path).await {
                    let msg = format!("Failed to rename and backup conflicted data dir: {:?}", e);
                    log::error!("{}", &msg);
                    return Err(msg);
                }
            }

            dir_cleanups.push(DeleteDirOnDrop::new(new_data_path.clone()));

            if let Err(e) = modify_guard::copy_dir(
                &old_data_path,
                &new_data_path,
                false,
                FileTransferGuard::new(Some(old_path.clone()), Some(new_path.clone())),
                |_, _| {},
            )
            .await
            {
                let msg = format!("Failed to copy data dir: {:?}", e);
                log::error!("{}", &msg);
                return Err(msg);
            }
        }

        if old_images_path.exists() {
            if new_images_path.exists() {
                if let Err(e) = rename_conflict_dir(&new_images_path).await {
                    let msg = format!("Failed to rename and backup conflicted images dir: {:?}", e);
                    log::error!("{}", &msg);
                    return Err(msg);
                }
            }

            dir_cleanups.push(DeleteDirOnDrop::new(new_images_path.clone()));

            if let Err(e) = modify_guard::copy_dir(
                &old_images_path,
                &new_images_path,
                false,
                FileTransferGuard::new(Some(old_path.clone()), Some(new_path.clone())),
                |_, _| {},
            )
            .await
            {
                let msg = format!("Failed to copy images dir: {:?}", e);
                log::error!("{}", &msg);
                return Err(msg);
            }
        }

        self.avatar_store = JsonStore::create(new_path.clone())?;
        self.avatar_wearable_store = JsonStore::create(new_path.clone())?;
        self.world_object_store = JsonStore::create(new_path.clone())?;

        self.data_dir = new_path.clone();

        let result = self.load_all_assets_from_files().await;

        if let Err(e) = result {
            return Err(format!("Failed to load assets: {:?}", e));
        }

        dir_cleanups
            .iter_mut()
            .for_each(|cleanup| cleanup.mark_as_completed());

        for old in vec![old_metadata_path, old_data_path, old_images_path] {
            let mut successfully_deleted = true;

            if old.exists() {
                log::info!("Removing old dir: {}", old.display());
                let result =
                    modify_guard::delete_recursive(&old, DeletionGuard::new(old_path.clone()))
                        .await;

                if let Err(e) = result {
                    log::warn!("Failed to remove old data dir: {:?}", e);
                    successfully_deleted = false;
                }
            }

            if !successfully_deleted {
                return Ok(MigrateResult::MigratedButFailedToDeleteOldDir);
            }
        }

        Ok(MigrateResult::Migrated)
    }
}

#[derive(Serialize, Debug, Clone, Copy, PartialEq, Eq, specta::Type)]
pub enum MigrateResult {
    Migrated,
    MigratedButFailedToDeleteOldDir,
}

async fn rename_conflict_dir(path: &PathBuf) -> Result<(), std::io::Error> {
    let filename = path
        .file_name()
        .unwrap_or(OsStr::new("conflicted"))
        .to_str()
        .unwrap_or("conflicted");

    let filename = format!("{}_backup", filename);

    let mut new_name = path.with_file_name(&filename);
    let mut count = 1;

    while new_name.exists() {
        new_name.set_file_name(format!("{}_{}", filename, count));

        count += 1;
    }

    modify_guard::move_file_or_dir(
        path,
        &new_name,
        // pathからの相対的なパスしかFileTransferGuardとして指定できず、アサーションの意味がないのでNoneとする
        FileTransferGuard::new(None, None),
    )
    .await
}

async fn backup_metadata(data_dir: &PathBuf) -> Result<(), String> {
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

        let result = modify_guard::copy_file(
            &path,
            &backup_file,
            false,
            FileTransferGuard::new(None, None),
        )
        .await;

        if let Err(e) = result {
            let msg = format!("Failed to backup metadata: {:?}", e);
            log::warn!("{}", msg);
            return Err(msg);
        }
    }

    log::info!(
        "Successfully created metadata backup in {}",
        backup_path.display()
    );

    Ok(())
}

async fn prune_old_backup(data_dir: &PathBuf) -> Result<(), String> {
    let backup_path = data_dir.join("metadata/backups");

    if !backup_path.exists() {
        return Ok(());
    }

    let mut entries = Vec::new();

    let read_dir =
        std::fs::read_dir(&backup_path).map_err(|e| format!("Failed to read dir: {:?}", e))?;

    for entry in read_dir {
        let entry = entry.map_err(|e| format!("Failed to read entry: {:?}", e))?;
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
        let a = a
            .file_name()
            .unwrap_or(OsStr::new(""))
            .to_str()
            .unwrap_or("");
        let b = b
            .file_name()
            .unwrap_or(OsStr::new(""))
            .to_str()
            .unwrap_or("");

        a.cmp(b)
    });

    let to_remove = entries.len() - 10;

    for i in 0..to_remove {
        let path = &entries[i];

        let result =
            modify_guard::delete_recursive(&path, DeletionGuard::new(backup_path.clone())).await;

        if let Err(e) = result {
            log::warn!("Failed to remove old backup: {:?}", e);
        }
    }

    Ok(())
}
