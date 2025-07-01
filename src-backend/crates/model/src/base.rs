use std::collections::BTreeSet;

use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Copy, Clone, Eq, PartialEq, specta::Type)]
pub enum AssetType {
    Avatar,
    AvatarWearable,
    WorldObject,
    OtherAsset,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct Avatar {
    pub id: Uuid,
    pub description: AssetDescription,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct AvatarWearable {
    pub id: Uuid,
    pub description: AssetDescription,
    pub category: String,
    pub supported_avatars: BTreeSet<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct WorldObject {
    pub id: Uuid,
    pub description: AssetDescription,
    pub category: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct OtherAsset {
    pub id: Uuid,
    pub description: AssetDescription,
    pub category: String,
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
