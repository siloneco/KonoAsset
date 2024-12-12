use std::collections::HashSet;

use serde::{Deserialize, Serialize};

use super::entities::AssetDescription;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PreAvatarAsset {
    pub description: AssetDescription,
}

impl PreAvatarAsset {
    pub fn create(description: AssetDescription) -> Self {
        Self { description }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PreAvatarRelatedAsset {
    pub description: AssetDescription,
    pub category: String,
    pub supported_avatars: HashSet<String>,
}

impl PreAvatarRelatedAsset {
    pub fn create(
        description: AssetDescription,
        category: String,
        supported_avatars: HashSet<String>,
    ) -> Self {
        Self {
            description,
            category,
            supported_avatars,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PreWorldAsset {
    pub description: AssetDescription,
    pub category: String,
}

impl PreWorldAsset {
    pub fn create(description: AssetDescription, category: String) -> Self {
        Self {
            description,
            category,
        }
    }
}
