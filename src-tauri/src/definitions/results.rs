use serde::{Deserialize, Serialize};

use super::entities::{AssetType, Avatar, AvatarWearable, WorldObject};

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct GetAssetResult {
    pub asset_type: AssetType,

    pub avatar: Option<Avatar>,
    pub avatar_wearable: Option<AvatarWearable>,
    pub world_object: Option<WorldObject>,
}

impl GetAssetResult {
    pub fn avatar(asset: Avatar) -> Self {
        Self {
            asset_type: AssetType::Avatar,
            avatar: Some(asset),
            avatar_wearable: None,
            world_object: None,
        }
    }

    pub fn avatar_wearable(asset: AvatarWearable) -> Self {
        Self {
            asset_type: AssetType::AvatarWearable,
            avatar: None,
            avatar_wearable: Some(asset),
            world_object: None,
        }
    }

    pub fn world_object(asset: WorldObject) -> Self {
        Self {
            asset_type: AssetType::WorldObject,
            avatar: None,
            avatar_wearable: None,
            world_object: Some(asset),
        }
    }
}
