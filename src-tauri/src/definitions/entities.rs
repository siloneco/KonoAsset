use std::{collections::BTreeSet, path::PathBuf};

use serde::{Deserialize, Serialize};
use tauri_specta::Event;
use uuid::Uuid;

use crate::loader::{
    HashSetVersionedLoader, VersionedAvatarWearables, VersionedAvatars, VersionedOtherAssets,
    VersionedWorldObjects,
};

use super::traits::AssetTrait;

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct AssetSummary {
    pub id: Uuid,
    pub asset_type: AssetType,
    pub name: String,
    pub creator: String,
    pub image_filename: Option<String>,
    pub has_memo: bool,
    pub dependencies: Vec<Uuid>,
    pub booth_item_id: Option<u64>,
    pub published_at: Option<i64>,
}

impl From<&Avatar> for AssetSummary {
    fn from(asset: &Avatar) -> Self {
        Self {
            id: asset.id,
            asset_type: AssetType::Avatar,
            name: asset.description.name.clone(),
            creator: asset.description.creator.clone(),
            image_filename: asset.description.image_filename.clone(),
            has_memo: asset.description.memo.is_some(),
            dependencies: asset.description.dependencies.clone(),
            booth_item_id: asset.description.booth_item_id,
            published_at: asset.description.published_at,
        }
    }
}

impl From<&AvatarWearable> for AssetSummary {
    fn from(asset: &AvatarWearable) -> Self {
        Self {
            id: asset.id,
            asset_type: AssetType::AvatarWearable,
            name: asset.description.name.clone(),
            creator: asset.description.creator.clone(),
            image_filename: asset.description.image_filename.clone(),
            has_memo: asset.description.memo.is_some(),
            dependencies: asset.description.dependencies.clone(),
            booth_item_id: asset.description.booth_item_id,
            published_at: asset.description.published_at,
        }
    }
}

impl From<&WorldObject> for AssetSummary {
    fn from(asset: &WorldObject) -> Self {
        Self {
            id: asset.id,
            asset_type: AssetType::WorldObject,
            name: asset.description.name.clone(),
            creator: asset.description.creator.clone(),
            image_filename: asset.description.image_filename.clone(),
            has_memo: asset.description.memo.is_some(),
            dependencies: asset.description.dependencies.clone(),
            booth_item_id: asset.description.booth_item_id,
            published_at: asset.description.published_at,
        }
    }
}

impl From<&OtherAsset> for AssetSummary {
    fn from(asset: &OtherAsset) -> Self {
        Self {
            id: asset.id,
            asset_type: AssetType::OtherAsset,
            name: asset.description.name.clone(),
            creator: asset.description.creator.clone(),
            image_filename: asset.description.image_filename.clone(),
            has_memo: asset.description.memo.is_some(),
            dependencies: asset.description.dependencies.clone(),
            booth_item_id: asset.description.booth_item_id,
            published_at: asset.description.published_at,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct AssetDescription {
    pub name: String,
    pub creator: String,
    pub image_filename: Option<String>,
    pub tags: Vec<String>,
    pub memo: Option<String>,
    pub booth_item_id: Option<u64>,
    pub dependencies: Vec<Uuid>,
    pub created_at: i64,
    pub published_at: Option<i64>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash, specta::Type)]
pub struct Avatar {
    pub id: Uuid,
    pub description: AssetDescription,
}

impl Avatar {
    pub fn create(mut description: AssetDescription) -> Self {
        description.name = description.name.trim().to_string();
        description.creator = description.creator.trim().to_string();
        description.tags = description
            .tags
            .iter()
            .map(|tag| tag.trim().to_string())
            .collect();

        Self {
            id: Uuid::new_v4(),
            description,
        }
    }
}

impl AssetTrait for Avatar {
    fn filename() -> String {
        "avatars.json".into()
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn set_id(&mut self, id: Uuid) {
        self.id = id;
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }

    fn get_description_as_mut(&mut self) -> &mut AssetDescription {
        &mut self.description
    }
}

impl HashSetVersionedLoader<Avatar> for Avatar {
    type VersionedType = VersionedAvatars;
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct AvatarWearable {
    pub id: Uuid,
    pub description: AssetDescription,
    pub category: String,
    pub supported_avatars: BTreeSet<String>,
}

impl AvatarWearable {
    pub fn create(
        mut description: AssetDescription,
        mut category: String,
        mut supported_avatars: BTreeSet<String>,
    ) -> Self {
        description.name = description.name.trim().to_string();
        description.creator = description.creator.trim().to_string();
        description.tags = description
            .tags
            .iter()
            .map(|tag| tag.trim().to_string())
            .collect();

        category = category.trim().to_string();
        supported_avatars = supported_avatars
            .iter()
            .map(|avatar| avatar.trim().to_string())
            .collect();

        Self {
            id: Uuid::new_v4(),
            description,
            category,
            supported_avatars,
        }
    }
}

impl AssetTrait for AvatarWearable {
    fn filename() -> String {
        "avatarWearables.json".into()
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn set_id(&mut self, id: Uuid) {
        self.id = id;
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }

    fn get_description_as_mut(&mut self) -> &mut AssetDescription {
        &mut self.description
    }
}

impl HashSetVersionedLoader<AvatarWearable> for AvatarWearable {
    type VersionedType = VersionedAvatarWearables;
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash, specta::Type)]
pub struct WorldObject {
    pub id: Uuid,
    pub description: AssetDescription,
    pub category: String,
}

impl WorldObject {
    pub fn create(mut description: AssetDescription, mut category: String) -> Self {
        description.name = description.name.trim().to_string();
        description.creator = description.creator.trim().to_string();
        description.tags = description
            .tags
            .iter()
            .map(|tag| tag.trim().to_string())
            .collect();

        category = category.trim().to_string();

        Self {
            id: Uuid::new_v4(),
            description,
            category,
        }
    }
}

impl AssetTrait for WorldObject {
    fn filename() -> String {
        "worldObjects.json".into()
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn set_id(&mut self, id: Uuid) {
        self.id = id;
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }

    fn get_description_as_mut(&mut self) -> &mut AssetDescription {
        &mut self.description
    }
}

impl HashSetVersionedLoader<WorldObject> for WorldObject {
    type VersionedType = VersionedWorldObjects;
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash, specta::Type)]
pub struct OtherAsset {
    pub id: Uuid,
    pub description: AssetDescription,
    pub category: String,
}

impl OtherAsset {
    pub fn create(mut description: AssetDescription, mut category: String) -> Self {
        description.name = description.name.trim().to_string();
        description.creator = description.creator.trim().to_string();
        description.tags = description
            .tags
            .iter()
            .map(|tag| tag.trim().to_string())
            .collect();

        category = category.trim().to_string();

        Self {
            id: Uuid::new_v4(),
            description,
            category,
        }
    }
}

impl AssetTrait for OtherAsset {
    fn filename() -> String {
        "otherAssets.json".into()
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn set_id(&mut self, id: Uuid) {
        self.id = id;
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }

    fn get_description_as_mut(&mut self) -> &mut AssetDescription {
        &mut self.description
    }
}

impl HashSetVersionedLoader<OtherAsset> for OtherAsset {
    type VersionedType = VersionedOtherAssets;
}

#[derive(Serialize, Deserialize, Debug, Copy, Clone, Eq, PartialEq, specta::Type)]
pub enum AssetType {
    Avatar,
    AvatarWearable,
    WorldObject,
    OtherAsset,
}

#[derive(Serialize, Deserialize, Debug, Eq, PartialEq, specta::Type)]
pub enum SortBy {
    Name,
    Creator,
    CreatedAt,
    PublishedAt,
}

#[derive(Serialize, Deserialize, Debug, Eq, PartialEq, Clone, specta::Type)]
pub enum MatchType {
    AND,
    OR,
}

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct FilterRequest {
    pub asset_type: Option<AssetType>,
    pub query_text: Option<String>,
    pub categories: Option<Vec<String>>,
    pub tags: Option<Vec<String>>,
    pub tag_match_type: MatchType,
    pub supported_avatars: Option<Vec<String>>,
    pub supported_avatar_match_type: MatchType,
}

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct FileInfo {
    pub file_name: String,
    pub absolute_path: String,
}

impl FileInfo {
    pub fn new(file_name: String, absolute_path: String) -> Self {
        Self {
            file_name,
            absolute_path,
        }
    }
}

#[derive(Serialize, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct LoadResult {
    success: bool,
    preference_loaded: bool,
    message: Option<String>,
}

impl LoadResult {
    pub fn success() -> Self {
        Self {
            success: true,
            preference_loaded: true,
            message: None,
        }
    }

    pub fn error(preference_loaded: bool, message: String) -> Self {
        Self {
            success: false,
            preference_loaded,
            message: Some(message),
        }
    }
}

#[derive(Serialize, Clone, specta::Type, Event)]
#[serde(rename_all = "camelCase")]
pub struct ProgressEvent {
    pub percentage: f32,
    pub filename: String,
}

impl ProgressEvent {
    pub fn new(percentage: f32, filename: String) -> Self {
        Self {
            percentage,
            filename,
        }
    }
}

#[derive(specta::Type)]
pub struct InitialSetup {
    pub require_initial_setup: bool,
    pub preference_file: PathBuf,
}

impl InitialSetup {
    pub fn new(preference_file: PathBuf) -> Self {
        Self {
            require_initial_setup: !preference_file.exists(),
            preference_file,
        }
    }

    pub fn update(&mut self) {
        self.require_initial_setup = !self.preference_file.exists();
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub enum AssetUpdatePayload {
    Avatar(Avatar),
    AvatarWearable(AvatarWearable),
    WorldObject(WorldObject),
    OtherAsset(OtherAsset),
}
