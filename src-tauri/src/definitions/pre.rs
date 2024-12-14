use std::collections::BTreeSet;

use serde::{Deserialize, Serialize};

use super::entities::AssetDescription;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PreAvatarAsset {
    pub description: AssetDescription,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PreAvatarRelatedAsset {
    pub description: AssetDescription,
    pub category: String,
    pub supported_avatars: BTreeSet<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PreWorldAsset {
    pub description: AssetDescription,
    pub category: String,
}
