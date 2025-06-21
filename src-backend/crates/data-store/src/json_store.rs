use std::{
    collections::{HashMap, HashSet},
    fs::File,
    hash::Hash,
    path::{Path, PathBuf},
};

use loader::HashSetVersionedLoader;
use model::AssetTrait;
use serde::{Serialize, de::DeserializeOwned};
use tokio::sync::Mutex;
use uuid::Uuid;

use crate::utils::execute_image_fixation;

use super::delete::delete_asset_image;

pub struct JsonStore<
    T: AssetTrait + HashSetVersionedLoader<T> + Clone + Serialize + DeserializeOwned + Eq + Hash,
> {
    data_dir: PathBuf,
    assets: Mutex<HashSet<T>>,
}

impl<T: AssetTrait + HashSetVersionedLoader<T> + Clone + Serialize + DeserializeOwned + Eq + Hash>
    JsonStore<T>
{
    pub fn create<P: AsRef<Path>>(data_dir: P) -> Result<Self, String> {
        let data_dir = data_dir.as_ref();

        let path = data_dir.join("metadata");

        if !path.exists() {
            std::fs::create_dir_all(&path)
                .map_err(|e| format!("Failed to create directory at {}: {}", path.display(), e))?;
        }

        Ok(Self {
            data_dir: data_dir.to_path_buf(),
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

    pub async fn delete_dependency(&self, id: Uuid) -> Result<bool, String> {
        {
            let mut assets = self.assets.lock().await;
            let cloned_assets = assets.clone();

            for asset in cloned_assets {
                let dependencies = &asset.get_description().dependencies;

                if dependencies.contains(&id) {
                    let mut new_dependencies = dependencies.clone();
                    new_dependencies.retain(|&x| x != id);

                    let mut new_asset = asset.clone();
                    new_asset.get_description_as_mut().dependencies = new_dependencies;

                    assets.remove(&asset);
                    assets.insert(new_asset);
                }
            }
        }

        self.save().await?;

        Ok(true)
    }

    pub async fn merge_from(
        &self,
        other: &JsonStore<T>,
        reassign_map: &HashMap<Uuid, Uuid>,
    ) -> Result<(), String> {
        {
            let mut assets = self.assets.lock().await;
            let other_assets = other.assets.lock().await.clone();

            for mut asset in other_assets {
                if let Some(new_id) = reassign_map.get(&asset.get_id()) {
                    asset.set_id(new_id.clone());
                }

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

#[cfg(test)]
mod tests {
    use file::modify_guard::{self, FileTransferGuard};
    use model::{AssetDescription, Avatar};
    use std::str::FromStr;

    use super::*;

    #[tokio::test]
    async fn test_json_store_as_avatar() {
        let data_dir = "test/temp/json_store/avatar";

        if std::fs::exists(data_dir).unwrap() {
            std::fs::remove_dir_all(data_dir).unwrap();
        }

        std::fs::create_dir_all(data_dir).unwrap();

        modify_guard::copy_dir(
            "../../test/example_root_dir/sample1",
            data_dir,
            false,
            FileTransferGuard::none(),
            |_, _| {},
        )
        .await
        .unwrap();

        let store: JsonStore<Avatar> = JsonStore::create(data_dir).unwrap();
        store.load().await.unwrap();

        let existing_avatar_id = Uuid::from_str("72e89e43-2d29-4910-b24e-9550a6ea7152").unwrap();

        let all_assets = store.get_all().await;
        assert_eq!(all_assets.len(), 1);
        assert!(all_assets.iter().any(|a| a.get_id() == existing_avatar_id));

        let avatar = store.get_asset(existing_avatar_id).await.unwrap();

        let expected_avatar = Avatar {
            id: Uuid::from_str("72e89e43-2d29-4910-b24e-9550a6ea7152").unwrap(),
            description: AssetDescription {
                name: "Test Avatar".into(),
                creator: "Test Avatar Creator".into(),
                image_filename: Some("843e178b-6865-4834-a51c-ac5f9eccbdbf.jpg".into()),
                tags: vec!["TestAvatarTag".into()],
                memo: Some("Test Avatar Memo".into()),
                booth_item_id: Some(6641548),
                dependencies: vec![],
                created_at: 1743606000000,
                published_at: Some(1735657200000),
            },
        };

        assert_eq!(avatar, expected_avatar);

        let new_avatar_uuid = Uuid::new_v4();
        let new_avatar_dependency_id = Uuid::new_v4();
        let mut new_avatar = Avatar {
            id: new_avatar_uuid.clone(),
            description: AssetDescription {
                name: "New Test Avatar".into(),
                creator: "New Test Avatar Creator".into(),
                image_filename: Some("new_avatar_image.jpg".into()),
                tags: vec!["NewTestAvatarTag".into()],
                memo: Some("New Test Avatar Memo".into()),
                booth_item_id: Some(6641548),
                dependencies: vec![new_avatar_dependency_id.clone()],
                created_at: 1234560000000,
                published_at: Some(1234560000000),
            },
        };

        store.add_asset_and_save(new_avatar.clone()).await.unwrap();

        let all_assets = store.get_all().await;
        assert_eq!(all_assets.len(), 2);
        assert!(all_assets.iter().any(|a| a.get_id() == new_avatar_uuid));
        assert_eq!(store.get_asset(new_avatar_uuid).await.unwrap(), new_avatar);

        new_avatar.description.name = "Updated Test Avatar".into();

        store
            .update_asset_and_save(new_avatar.clone())
            .await
            .unwrap();

        let all_assets = store.get_all().await;
        assert_eq!(all_assets.len(), 2);
        assert!(all_assets.iter().any(|a| a.get_id() == new_avatar_uuid));
        assert_eq!(store.get_asset(new_avatar_uuid).await.unwrap(), new_avatar);

        let mut non_existing_avatar = new_avatar.clone();
        non_existing_avatar.id = Uuid::new_v4();

        assert_eq!(
            store
                .update_asset_and_save(non_existing_avatar.clone())
                .await
                .unwrap_err(),
            "Asset not found".to_string()
        );

        assert_eq!(store.get_all().await.len(), 2);

        store
            .delete_asset_and_save(existing_avatar_id)
            .await
            .unwrap();

        let all_assets = store.get_all().await;
        assert_eq!(all_assets.len(), 1);
        assert!(all_assets.iter().any(|a| a.get_id() == new_avatar_uuid));
        assert!(!all_assets.iter().any(|a| a.get_id() == existing_avatar_id));

        store
            .delete_dependency(new_avatar_dependency_id)
            .await
            .unwrap();

        let fetched_new_avatar = store.get_asset(new_avatar_uuid).await.unwrap();
        assert_eq!(fetched_new_avatar.description.dependencies.len(), 0);
    }
}
