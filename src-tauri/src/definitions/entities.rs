use std::collections::BTreeSet;

use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::traits::AssetTrait;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash)]
pub struct AssetDescription {
    pub title: String,
    pub author: String,
    pub image_src: String,
    pub tags: Vec<String>,
    pub created_at: DateTime<Local>,
}

impl AssetDescription {
    pub fn create(
        title: String,
        author: String,
        image_src: String,
        tags: Vec<String>,
        created_at: DateTime<Local>,
    ) -> Self {
        Self {
            title,
            author,
            image_src,
            tags,
            created_at,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash)]
pub struct AvatarAsset {
    pub id: Uuid,
    pub description: AssetDescription,
}

impl AvatarAsset {
    pub fn create(description: AssetDescription) -> Self {
        Self {
            id: Uuid::new_v4(),
            description,
        }
    }
}

impl AssetTrait for AvatarAsset {
    fn filename() -> String {
        "avatar.json".into()
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash)]
pub struct AvatarRelatedAsset {
    pub id: Uuid,
    pub description: AssetDescription,
    pub category: String,
    pub supported_avatars: BTreeSet<String>,
}

impl AvatarRelatedAsset {
    pub fn create(
        description: AssetDescription,
        category: String,
        supported_avatars: BTreeSet<String>,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            description,
            category,
            supported_avatars,
        }
    }
}

impl AssetTrait for AvatarRelatedAsset {
    fn filename() -> String {
        "avatar_related_assets.json".into()
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash)]
pub struct WorldAsset {
    pub id: Uuid,
    pub description: AssetDescription,
    pub category: String,
}

impl WorldAsset {
    pub fn create(description: AssetDescription, category: String) -> Self {
        Self {
            id: Uuid::new_v4(),
            description,
            category,
        }
    }
}

impl AssetTrait for WorldAsset {
    fn filename() -> String {
        "world_related_assets.json".into()
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, Eq, PartialEq)]
pub enum AssetType {
    Avatar,
    AvatarRelated,
    World,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FilterRequest {
    pub asset_type: Option<AssetType>,
    pub query: Option<String>,
    pub categories: Option<Vec<String>>,
    pub tags: Option<Vec<String>>,
    pub supported_avatars: Option<Vec<String>>,
}
