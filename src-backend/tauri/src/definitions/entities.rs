use std::path::PathBuf;

use model::{AssetType, Avatar, AvatarWearable, OtherAsset, WorldObject};
use serde::{Deserialize, Serialize};
use tauri_specta::Event;

use crate::loader::{
    HashSetVersionedLoader, VersionedAvatarWearables, VersionedAvatars, VersionedOtherAssets,
    VersionedWorldObjects,
};

impl HashSetVersionedLoader<Avatar> for Avatar {
    type VersionedType = VersionedAvatars;
}

impl HashSetVersionedLoader<AvatarWearable> for AvatarWearable {
    type VersionedType = VersionedAvatarWearables;
}

impl HashSetVersionedLoader<WorldObject> for WorldObject {
    type VersionedType = VersionedWorldObjects;
}

impl HashSetVersionedLoader<OtherAsset> for OtherAsset {
    type VersionedType = VersionedOtherAssets;
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
