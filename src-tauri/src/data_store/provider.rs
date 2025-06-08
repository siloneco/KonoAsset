use std::{
    collections::{HashMap, HashSet},
    ffi::OsStr,
    fs,
    hash::Hash,
    path::{Path, PathBuf},
};

use serde::{de::DeserializeOwned, Serialize};
use tauri::AppHandle;
use tauri_specta::Event;
use uuid::Uuid;

use crate::{
    data_store::delete::delete_asset_image,
    definitions::{
        entities::{
            AssetType, AssetUpdatePayload, Avatar, AvatarWearable, OtherAsset, ProgressEvent,
            WorldObject,
        },
        traits::AssetTrait,
    },
    file::{
        cleanup::DeleteOnDrop,
        modify_guard::{self, DeletionGuard, FileTransferGuard},
    },
    importer::execute_image_fixation,
    loader::HashSetVersionedLoader,
};

use super::json_store::JsonStore;

pub struct StoreProvider {
    data_dir: PathBuf,

    avatar_store: JsonStore<Avatar>,
    avatar_wearable_store: JsonStore<AvatarWearable>,
    world_object_store: JsonStore<WorldObject>,
    other_asset_store: JsonStore<OtherAsset>,
}

impl StoreProvider {
    pub fn create<T: AsRef<Path>>(data_dir: T) -> Result<Self, String> {
        let data_dir = data_dir.as_ref().to_path_buf();

        let avatar_store: JsonStore<Avatar> = JsonStore::create(&data_dir)?;
        let avatar_wearable_store: JsonStore<AvatarWearable> = JsonStore::create(&data_dir)?;
        let world_object_store: JsonStore<WorldObject> = JsonStore::create(&data_dir)?;
        let other_asset_store: JsonStore<OtherAsset> = JsonStore::create(&data_dir)?;

        Ok(Self {
            data_dir,

            avatar_store: avatar_store,
            avatar_wearable_store: avatar_wearable_store,
            world_object_store: world_object_store,
            other_asset_store: other_asset_store,
        })
    }

    pub async fn load_all_assets_from_files(&mut self) -> Result<(), String> {
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

        match self.other_asset_store.load().await {
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

    pub fn get_other_asset_store(&self) -> &JsonStore<OtherAsset> {
        &self.other_asset_store
    }

    pub fn data_dir(&self) -> PathBuf {
        self.data_dir.clone()
    }

    pub async fn get_used_ids(&self) -> HashSet<Uuid> {
        let mut ids = HashSet::new();

        ids.extend(self.avatar_store.get_all().await.iter().map(|a| a.get_id()));
        ids.extend(
            self.avatar_wearable_store
                .get_all()
                .await
                .iter()
                .map(|a| a.get_id()),
        );
        ids.extend(
            self.world_object_store
                .get_all()
                .await
                .iter()
                .map(|a| a.get_id()),
        );
        ids.extend(
            self.other_asset_store
                .get_all()
                .await
                .iter()
                .map(|a| a.get_id()),
        );

        ids
    }

    pub async fn update_asset_and_save(&self, asset: AssetUpdatePayload) -> Result<(), String> {
        match asset {
            AssetUpdatePayload::Avatar(avatar) => {
                if self.avatar_store.get_asset(avatar.id).await.is_some() {
                    return self.avatar_store.update_asset_and_save(avatar).await;
                }

                migrate_asset_type(self, &self.avatar_store, avatar).await
            }
            AssetUpdatePayload::AvatarWearable(avatar_wearable) => {
                if self
                    .avatar_wearable_store
                    .get_asset(avatar_wearable.id)
                    .await
                    .is_some()
                {
                    return self
                        .avatar_wearable_store
                        .update_asset_and_save(avatar_wearable)
                        .await;
                }

                migrate_asset_type(self, &self.avatar_wearable_store, avatar_wearable).await
            }
            AssetUpdatePayload::WorldObject(world_object) => {
                if self
                    .world_object_store
                    .get_asset(world_object.id)
                    .await
                    .is_some()
                {
                    return self
                        .world_object_store
                        .update_asset_and_save(world_object)
                        .await;
                }

                migrate_asset_type(self, &self.world_object_store, world_object).await
            }
            AssetUpdatePayload::OtherAsset(other_asset) => {
                if self
                    .other_asset_store
                    .get_asset(other_asset.id)
                    .await
                    .is_some()
                {
                    return self
                        .other_asset_store
                        .update_asset_and_save(other_asset)
                        .await;
                }

                migrate_asset_type(self, &self.other_asset_store, other_asset).await
            }
        }
    }

    pub async fn migrate_data_dir<P>(
        &mut self,
        app: &AppHandle,
        new_path: P,
    ) -> Result<MigrateResult, String>
    where
        P: AsRef<Path>,
    {
        self.internal_migrate_data_dir(Some(app), new_path).await
    }

    async fn internal_migrate_data_dir<P>(
        &mut self,
        app: Option<&AppHandle>,
        new_path: P,
    ) -> Result<MigrateResult, String>
    where
        P: AsRef<Path>,
    {
        let new_path = new_path.as_ref();

        if !new_path.is_dir() {
            return Err("New path is not a directory".into());
        }

        if !new_path.exists() {
            fs::create_dir_all(&new_path)
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

            dir_cleanups.push(DeleteOnDrop::new(new_metadata_path.clone()));

            if let Err(e) = modify_guard::copy_dir(
                old_metadata_path.clone(),
                new_metadata_path.clone(),
                false,
                FileTransferGuard::both(&old_path, &new_path.to_path_buf()),
                |progress, filename| {
                    if let Some(app) = app {
                        // プログレスバーのうち 1/10 をメタデータのコピーとして扱う
                        // progress は 0 - 1 の範囲であるため、10倍して % に変換する
                        let percentage = progress * 10f32;

                        if let Err(e) = ProgressEvent::new(percentage, filename).emit(app) {
                            log::error!("Failed to emit progress event: {:?}", e);
                        }
                    }
                },
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

            dir_cleanups.push(DeleteOnDrop::new(new_data_path.clone()));

            if let Err(e) = modify_guard::copy_dir(
                old_data_path.clone(),
                new_data_path.clone(),
                false,
                FileTransferGuard::both(&old_path, &new_path.to_path_buf()),
                |progress, filename| {
                    if let Some(app) = app {
                        // プログレスバーのうち 8/10 をデータのコピーとして扱う
                        // progress は 0 - 1 の範囲であるため、80倍して % に変換する
                        let percentage = 10f32 + (progress * 80f32);

                        if let Err(e) = ProgressEvent::new(percentage, filename).emit(app) {
                            log::error!("Failed to emit progress event: {:?}", e);
                        }
                    }
                },
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

            dir_cleanups.push(DeleteOnDrop::new(new_images_path.clone()));

            if let Err(e) = modify_guard::copy_dir(
                old_images_path.clone(),
                new_images_path.clone(),
                false,
                FileTransferGuard::both(&old_path, &new_path.to_path_buf()),
                |progress, filename| {
                    if let Some(app) = app {
                        // プログレスバーのうち 1/10 を画像のコピーとして扱う
                        // progress は 0 - 1 の範囲であるため、10倍して % に変換する
                        let percentage = 90f32 + (progress * 10f32);

                        if let Err(e) = ProgressEvent::new(percentage, filename).emit(app) {
                            log::error!("Failed to emit progress event: {:?}", e);
                        }
                    }
                },
            )
            .await
            {
                let msg = format!("Failed to copy images dir: {:?}", e);
                log::error!("{}", &msg);
                return Err(msg);
            }
        }

        if let Err(e) = self.set_data_dir_and_reload(new_path).await {
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
                    modify_guard::delete_recursive(&old, &DeletionGuard::new(&old_path)).await;

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

    pub async fn merge_from(
        &mut self,
        external: &StoreProvider,
        reassign_map: &HashMap<Uuid, Uuid>,
    ) -> Result<(), String> {
        self.avatar_store
            .merge_from(&external.avatar_store, reassign_map)
            .await?;
        self.avatar_wearable_store
            .merge_from(&external.avatar_wearable_store, reassign_map)
            .await?;
        self.world_object_store
            .merge_from(&external.world_object_store, reassign_map)
            .await?;
        self.other_asset_store
            .merge_from(&external.other_asset_store, reassign_map)
            .await?;

        Ok(())
    }

    pub async fn set_data_dir_and_reload<P>(&mut self, new_path: P) -> Result<(), String>
    where
        P: AsRef<Path>,
    {
        let new_path = new_path.as_ref().to_path_buf();

        self.avatar_store = JsonStore::create(&new_path)?;
        self.avatar_wearable_store = JsonStore::create(&new_path)?;
        self.world_object_store = JsonStore::create(&new_path)?;
        self.other_asset_store = JsonStore::create(&new_path)?;

        self.data_dir = new_path;

        self.load_all_assets_from_files().await
    }

    pub async fn remove_all_dependencies(&self, id: Uuid) -> Result<(), String> {
        self.avatar_store.delete_dependency(id).await?;
        self.avatar_wearable_store.delete_dependency(id).await?;
        self.world_object_store.delete_dependency(id).await?;
        self.other_asset_store.delete_dependency(id).await?;

        return Ok(());
    }

    pub async fn create_backup<P: AsRef<Path>>(
        &self,
        metadata_backup_dir: P,
    ) -> Result<(), String> {
        prune_old_backup(&metadata_backup_dir).await?;

        let metadata_path = self.data_dir.join("metadata");
        if !metadata_path.exists() {
            return Ok(());
        }

        let dir_name = chrono::Local::now().format("%Y-%m-%d_%H-%M-%S").to_string();
        let backup_path = metadata_backup_dir.as_ref().join(dir_name);

        let result = std::fs::create_dir_all(&backup_path);

        if result.is_err() {
            return Err("Failed to create backup directory".into());
        }

        let files = vec![
            Avatar::filename(),
            AvatarWearable::filename(),
            WorldObject::filename(),
            OtherAsset::filename(),
        ];

        for file in files {
            let path = metadata_path.join(&file);
            if !path.exists() {
                continue;
            }

            let backup_file = backup_path.join(&file);

            let result =
                modify_guard::copy_file(&path, &backup_file, false, FileTransferGuard::none())
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
}

async fn migrate_asset_type<T>(
    provider: &StoreProvider,
    dest_json_store: &JsonStore<T>,
    mut asset: T,
) -> Result<(), String>
where
    T: AssetTrait + HashSetVersionedLoader<T> + Clone + Serialize + DeserializeOwned + Eq + Hash,
{
    let id = asset.get_id();

    if T::asset_type() != AssetType::Avatar {
        if let Some(avatar) = provider.avatar_store.get_asset(id).await {
            asset.get_description_as_mut().created_at = avatar.description.created_at;
            handle_image_change(
                &mut asset,
                &provider.data_dir,
                avatar.description.image_filename.as_ref(),
            )
            .await?;

            dest_json_store.add_asset_and_save(asset).await?;
            provider.avatar_store.delete_asset_and_save(id).await?;

            return Ok(());
        }
    }

    if T::asset_type() != AssetType::AvatarWearable {
        if let Some(avatar_wearable) = provider.avatar_wearable_store.get_asset(id).await {
            asset.get_description_as_mut().created_at = avatar_wearable.description.created_at;
            handle_image_change(
                &mut asset,
                &provider.data_dir,
                avatar_wearable.description.image_filename.as_ref(),
            )
            .await?;

            dest_json_store.add_asset_and_save(asset).await?;
            provider
                .avatar_wearable_store
                .delete_asset_and_save(id)
                .await?;

            return Ok(());
        }
    }

    if T::asset_type() != AssetType::WorldObject {
        if let Some(world_object) = provider.world_object_store.get_asset(id).await {
            asset.get_description_as_mut().created_at = world_object.description.created_at;
            handle_image_change(
                &mut asset,
                &provider.data_dir,
                world_object.description.image_filename.as_ref(),
            )
            .await?;

            dest_json_store.add_asset_and_save(asset).await?;
            provider
                .world_object_store
                .delete_asset_and_save(id)
                .await?;

            return Ok(());
        }
    }

    if let Some(other_asset) = provider.other_asset_store.get_asset(id).await {
        asset.get_description_as_mut().created_at = other_asset.description.created_at;
        handle_image_change(
            &mut asset,
            &provider.data_dir,
            other_asset.description.image_filename.as_ref(),
        )
        .await?;

        dest_json_store.add_asset_and_save(asset).await?;
        provider.other_asset_store.delete_asset_and_save(id).await?;

        return Ok(());
    }

    Err("Asset not found".into())
}

async fn handle_image_change<T: AssetTrait>(
    asset: &mut T,
    data_dir: &Path,
    old_image: Option<&String>,
) -> Result<(), String> {
    let new_image = asset.get_description().image_filename.as_ref();

    if old_image == new_image {
        return Ok(());
    }

    let images_dir = data_dir.join("images");

    if let Some(old_image_filename) = old_image {
        delete_asset_image(&data_dir.to_path_buf(), old_image_filename).await?;
    }

    if let Some(new_image_filename) = new_image {
        let temp_new_image = images_dir.join(new_image_filename);
        let new_image_path = execute_image_fixation(&temp_new_image).await?;

        if let Some(new_image_filename) = new_image_path {
            asset.get_description_as_mut().image_filename = Some(new_image_filename);
        }
    }

    Ok(())
}

#[derive(Serialize, Debug, Clone, Copy, PartialEq, Eq, specta::Type)]
pub enum MigrateResult {
    Migrated,
    MigratedButFailedToDeleteOldDir,
}

async fn rename_conflict_dir<P: AsRef<Path>>(path: P) -> Result<(), std::io::Error> {
    let path = path.as_ref();

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
        FileTransferGuard::none(),
    )
    .await
}

async fn prune_old_backup<P: AsRef<Path>>(metadata_backup_dir: P) -> Result<(), String> {
    let backup_path = metadata_backup_dir.as_ref();

    if !backup_path.exists() {
        return Ok(());
    }

    let read_dir =
        std::fs::read_dir(&backup_path).map_err(|e| format!("Failed to read dir: {:?}", e))?;

    for entry in read_dir {
        let entry = entry.map_err(|e| format!("Failed to read entry: {:?}", e))?;
        let path = entry.path();

        if !path.is_dir() {
            continue;
        }

        let file_stem = path.file_stem().unwrap().to_str().unwrap();

        if is_outdated_timestamp(file_stem) {
            log::debug!("purging outdated metadata backup: {}", path.display());

            if let Err(e) =
                modify_guard::delete_recursive(&path, &DeletionGuard::new(&backup_path)).await
            {
                log::error!("Failed to remove outdated metadata backup: {:?}", e)
            };
        }
    }

    Ok(())
}

const BACKUP_RETENTION_DAYS: i64 = 7;

fn is_outdated_timestamp(timestamp: &str) -> bool {
    let timestamp = match chrono::NaiveDateTime::parse_from_str(&timestamp, "%Y-%m-%d_%H-%M-%S") {
        Ok(timestamp) => timestamp,
        Err(e) => {
            log::error!("error while parsing timestamp: {}", e);
            return false;
        }
    };

    let timestamp = chrono::DateTime::<chrono::Utc>::from_naive_utc_and_offset(
        timestamp,
        chrono::Utc::now().offset().clone(),
    );

    let threshold = chrono::Utc::now() - chrono::Duration::days(BACKUP_RETENTION_DAYS);

    timestamp < threshold
}

#[cfg(test)]
mod tests {
    use std::{collections::BTreeSet, str::FromStr};

    use crate::definitions::entities::AssetDescription;

    use super::*;

    async fn setup_dir<P, Q>(from: P, target: Q)
    where
        P: AsRef<Path>,
        Q: AsRef<Path>,
    {
        let target = target.as_ref().to_path_buf();
        let from = from.as_ref().to_path_buf();

        if target.exists() {
            std::fs::remove_dir_all(&target).unwrap();
        }

        modify_guard::copy_dir(from, target, false, FileTransferGuard::none(), |_, _| {})
            .await
            .unwrap();
    }

    #[tokio::test]
    async fn test_store_provider() {
        let from_one = "test/example_root_dir/sample1";
        let from_two = "test/example_root_dir/sample2";

        let base_dest = "test/temp/store_provider";

        let target_one = format!("{base_dest}/one");
        let target_two = format!("{base_dest}/two");

        setup_dir(from_one, &target_one).await;
        setup_dir(from_two, &target_two).await;

        let mut provider = StoreProvider::create(&target_one).unwrap();

        provider.load_all_assets_from_files().await.unwrap();

        let ids = provider.get_used_ids().await;

        assert_eq!(ids.len(), 4);
        assert!(ids.contains(&Uuid::from_str("72e89e43-2d29-4910-b24e-9550a6ea7152").unwrap()));
        assert!(ids.contains(&Uuid::from_str("2bde4d66-1843-4250-b929-157f947f5751").unwrap()));
        assert!(ids.contains(&Uuid::from_str("c155488e-53bf-4c98-92e5-e5c8f66a1667").unwrap()));
        assert!(ids.contains(&Uuid::from_str("b2003e9a-86c1-4ab6-9e6b-4388497e2226").unwrap()));

        let mut external_provider = StoreProvider::create(&target_two).unwrap();
        external_provider
            .load_all_assets_from_files()
            .await
            .unwrap();

        let mut duplicate_ids = HashMap::new();
        duplicate_ids.insert(
            Uuid::from_str("72e89e43-2d29-4910-b24e-9550a6ea7152").unwrap(),
            Uuid::from_str("c4b56003-0a93-405d-a4ed-054cb06fb778").unwrap(),
        );

        provider
            .merge_from(&external_provider, &duplicate_ids)
            .await
            .unwrap();

        assert_eq!(provider.get_used_ids().await.len(), 8);
        assert_eq!(provider.get_avatar_store().get_all().await.len(), 2);
        assert_eq!(
            provider.get_avatar_wearable_store().get_all().await.len(),
            2
        );
        assert_eq!(provider.get_world_object_store().get_all().await.len(), 2);
        assert_eq!(provider.get_other_asset_store().get_all().await.len(), 2);

        let mut avatars = provider.get_avatar_store().get_all().await.into_iter();
        assert_ne!(
            avatars.next().unwrap().get_id(),
            avatars.next().unwrap().get_id()
        );
    }

    #[tokio::test]
    async fn test_store_provider_migration() {
        let from = "test/example_root_dir/sample1";
        let current_path = "test/temp/store_provider_migration/current";
        let new_path = "test/temp/store_provider_migration/new";

        setup_dir(from, current_path).await;
        std::fs::create_dir_all(new_path).unwrap();

        let mut provider = StoreProvider::create(&current_path).unwrap();

        provider.load_all_assets_from_files().await.unwrap();

        let result = provider
            .internal_migrate_data_dir(None, new_path)
            .await
            .unwrap();

        assert_eq!(result, MigrateResult::Migrated);
    }

    #[tokio::test]
    async fn test_rename_conflict_dir() {
        let base = "test/temp/rename_conflict_dir";

        if std::fs::exists(base).unwrap() {
            std::fs::remove_dir_all(base).unwrap();
        }

        let path = format!("{base}/test_dir");

        std::fs::create_dir_all(&path).unwrap();
        rename_conflict_dir(&path).await.unwrap();

        assert!(std::fs::exists(format!("{path}_backup")).unwrap());

        std::fs::create_dir_all(&path).unwrap();
        rename_conflict_dir(&path).await.unwrap();

        assert!(std::fs::exists(format!("{path}_backup_1")).unwrap());
    }

    #[tokio::test]
    async fn test_prune_old_backup() {
        let base = "test/temp/prune_old_backup";

        if std::fs::exists(base).unwrap() {
            std::fs::remove_dir_all(base).unwrap();
        }

        std::fs::create_dir_all(base).unwrap();

        let path = format!("{base}/2025-04-01_00-00-00");
        std::fs::create_dir_all(&path).unwrap();

        prune_old_backup(base).await.unwrap();

        assert!(!std::fs::exists(path).unwrap());

        let current_dir_name = chrono::Local::now().format("%Y-%m-%d_%H-%M-%S").to_string();
        let path = format!("{base}/{current_dir_name}");
        std::fs::create_dir_all(&path).unwrap();

        prune_old_backup(base).await.unwrap();

        assert!(std::fs::exists(path).unwrap());
    }

    #[tokio::test]
    async fn test_update_asset_and_save() {
        let test_dir = "test/temp/update_asset_and_save";

        if std::fs::exists(test_dir).unwrap() {
            std::fs::remove_dir_all(test_dir).unwrap();
        }
        std::fs::create_dir_all(test_dir).unwrap();

        let mut provider = StoreProvider::create(test_dir).unwrap();
        provider.load_all_assets_from_files().await.unwrap();

        // Test updating existing avatar
        let avatar_id = Uuid::new_v4();
        let avatar = Avatar {
            id: avatar_id,
            description: AssetDescription {
                name: "Test Avatar".into(),
                creator: "Test Creator".into(),
                image_filename: None,
                tags: vec!["test".into()],
                memo: None,
                booth_item_id: None,
                dependencies: vec![],
                created_at: 1234567890000,
                published_at: None,
            },
        };

        provider
            .avatar_store
            .add_asset_and_save(avatar.clone())
            .await
            .unwrap();

        let mut updated_avatar = avatar.clone();
        updated_avatar.description.name = "Updated Avatar".into();

        provider
            .update_asset_and_save(AssetUpdatePayload::Avatar(updated_avatar.clone()))
            .await
            .unwrap();

        let stored_avatar = provider.avatar_store.get_asset(avatar_id).await.unwrap();
        assert_eq!(stored_avatar.description.name, "Updated Avatar");

        // Test converting from avatar to avatar wearable
        let avatar_wearable = AvatarWearable {
            id: avatar_id,
            description: AssetDescription {
                name: "Converted Wearable".into(),
                creator: "Test Creator".into(),
                image_filename: None,
                tags: vec!["test".into()],
                memo: None,
                booth_item_id: None,
                dependencies: vec![],
                created_at: 1234567890000,
                published_at: None,
            },
            category: "TestCategory".into(),
            supported_avatars: BTreeSet::new(),
        };

        provider
            .update_asset_and_save(AssetUpdatePayload::AvatarWearable(avatar_wearable.clone()))
            .await
            .unwrap();

        assert!(provider.avatar_store.get_asset(avatar_id).await.is_none());
        let stored_wearable = provider
            .avatar_wearable_store
            .get_asset(avatar_id)
            .await
            .unwrap();
        assert_eq!(stored_wearable.description.name, "Converted Wearable");
        assert_eq!(stored_wearable.description.created_at, 1234567890000);

        // Test converting from avatar wearable to world object
        let world_object = WorldObject {
            id: avatar_id,
            description: AssetDescription {
                name: "Converted World Object".into(),
                creator: "Test Creator".into(),
                image_filename: None,
                tags: vec!["test".into()],
                memo: None,
                booth_item_id: None,
                dependencies: vec![],
                created_at: 1234567890000,
                published_at: None,
            },
            category: "TestCategory".into(),
        };

        provider
            .update_asset_and_save(AssetUpdatePayload::WorldObject(world_object.clone()))
            .await
            .unwrap();

        assert!(provider
            .avatar_wearable_store
            .get_asset(avatar_id)
            .await
            .is_none());
        let stored_world = provider
            .world_object_store
            .get_asset(avatar_id)
            .await
            .unwrap();
        assert_eq!(stored_world.description.name, "Converted World Object");
        assert_eq!(stored_world.description.created_at, 1234567890000);

        // Test converting from world object to other asset
        let other_asset = OtherAsset {
            id: avatar_id,
            description: AssetDescription {
                name: "Converted Other Asset".into(),
                creator: "Test Creator".into(),
                image_filename: None,
                tags: vec!["test".into()],
                memo: None,
                booth_item_id: None,
                dependencies: vec![],
                created_at: 1234567890000,
                published_at: None,
            },
            category: "TestCategory".into(),
        };

        provider
            .update_asset_and_save(AssetUpdatePayload::OtherAsset(other_asset.clone()))
            .await
            .unwrap();

        assert!(provider
            .world_object_store
            .get_asset(avatar_id)
            .await
            .is_none());
        let stored_other = provider
            .other_asset_store
            .get_asset(avatar_id)
            .await
            .unwrap();
        assert_eq!(stored_other.description.name, "Converted Other Asset");
        assert_eq!(stored_other.description.created_at, 1234567890000);

        // Test error case - updating non-existent asset
        let non_existent_id = Uuid::new_v4();
        let non_existent_avatar = Avatar {
            id: non_existent_id,
            description: AssetDescription {
                name: "Non Existent".into(),
                creator: "Test Creator".into(),
                image_filename: None,
                tags: vec![],
                memo: None,
                booth_item_id: None,
                dependencies: vec![],
                created_at: 1234567890000,
                published_at: None,
            },
        };

        let result = provider
            .update_asset_and_save(AssetUpdatePayload::Avatar(non_existent_avatar))
            .await;
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Asset not found");
    }
}
