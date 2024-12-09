use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AssetItem {
    pub id: Uuid,
    pub title: String,
    pub author: String,
    pub types: Vec<AssetType>,
    pub image_src: String,
    pub category: AssetCategory,
    pub asset_dirs: Vec<String>,
    pub tags: Vec<AssetTag>,
    pub created_at: DateTime<Local>,
}

impl AssetItem {
    pub fn create(
        title: String,
        author: String,
        types: Vec<AssetType>,
        image_src: String,
        category: AssetCategory,
        asset_dirs: Vec<String>,
        tags: Vec<AssetTag>,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            title,
            author,
            types,
            image_src,
            category,
            asset_dirs,
            tags,
            created_at: Local::now(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AssetCategory {
    pub display_name: String,
}

impl AssetCategory {
    pub fn new(display_name: String) -> Self {
        Self { display_name }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AssetTag {
    pub name: String,
    pub color: String,
}

impl AssetTag {
    pub fn new(name: String, color: String) -> Self {
        Self { name, color }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash)]
pub enum AssetType {
    Avatar,
    AvatarRelatedAssets,
    WorldRelatedAssets,
}

impl AssetType {
    pub fn iter() -> impl Iterator<Item = AssetType> {
        vec![
            AssetType::Avatar,
            AssetType::AvatarRelatedAssets,
            AssetType::WorldRelatedAssets,
        ]
        .into_iter()
    }

    pub fn filename(&self) -> &str {
        match *self {
            AssetType::Avatar => "avatar.json",
            AssetType::AvatarRelatedAssets => "avatar_related_assets.json",
            AssetType::WorldRelatedAssets => "world_related_assets.json",
        }
    }

    pub fn display_name(&self) -> &str {
        match *self {
            AssetType::Avatar => "Avatar",
            AssetType::AvatarRelatedAssets => "Avatar Related Assets",
            AssetType::WorldRelatedAssets => "World Related Assets",
        }
    }
}
