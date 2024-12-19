use std::collections::BTreeSet;

use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::traits::AssetTrait;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AssetDisplay {
    pub id: Uuid,
    pub asset_type: AssetType,
    pub title: String,
    pub author: String,
    pub image_src: String,
    pub booth_url: Option<String>,
}

impl AssetDisplay {
    pub fn create(
        id: Uuid,
        asset_type: AssetType,
        title: String,
        author: String,
        image_src: String,
        booth_url: Option<String>,
    ) -> Self {
        Self {
            id,
            asset_type,
            title,
            author,
            image_src,
            booth_url,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash)]
pub struct AssetDescription {
    pub title: String,
    pub author: String,
    pub image_src: String,
    pub tags: Vec<String>,
    #[serde(default = "default_booth_url")]
    pub booth_url: Option<String>,
    pub created_at: i64,
}

fn default_booth_url() -> Option<String> {
    None
}

impl AssetDescription {
    pub fn create(
        title: String,
        author: String,
        image_src: String,
        tags: Vec<String>,
        booth_url: Option<String>,
        created_at: i64,
    ) -> Self {
        Self {
            title,
            author,
            image_src,
            tags,
            booth_url,
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

    fn get_description_as_mut(&mut self) -> &mut AssetDescription {
        &mut self.description
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
        "avatar_related.json".into()
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }

    fn get_description_as_mut(&mut self) -> &mut AssetDescription {
        &mut self.description
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
        "world.json".into()
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }

    fn get_description_as_mut(&mut self) -> &mut AssetDescription {
        &mut self.description
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, Eq, PartialEq)]
pub enum AssetType {
    Avatar,
    AvatarRelated,
    World,
}

#[derive(Serialize, Deserialize, Debug, Eq, PartialEq)]
pub enum SortBy {
    Title,
    CreatedAt,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FilterRequest {
    pub asset_type: Option<AssetType>,
    pub query: Option<String>,
    pub categories: Option<Vec<String>>,
    pub tags: Option<Vec<String>>,
    pub supported_avatars: Option<Vec<String>>,
}
