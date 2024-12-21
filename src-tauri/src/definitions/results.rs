use serde::{Deserialize, Serialize};

use super::entities::{AssetDescription, AssetType, AvatarAsset, AvatarRelatedAsset, WorldAsset};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DirectoryOpenResult {
    pub success: bool,
    pub error_message: Option<String>,
}

impl DirectoryOpenResult {
    pub fn create(success: bool, error_message: Option<String>) -> Self {
        Self {
            success,
            error_message,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FetchAssetDescriptionFromBoothResult {
    pub success: bool,
    pub asset_description: Option<AssetDescription>,
    pub estimated_asset_type: Option<AssetType>,
    pub error_message: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SimpleResult {
    pub success: bool,
    pub error_message: Option<String>,
}

impl SimpleResult {
    pub fn success() -> Self {
        Self {
            success: true,
            error_message: None,
        }
    }

    pub fn error(error_message: String) -> Self {
        Self {
            success: false,
            error_message: Some(error_message),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GetAssetResult {
    pub success: bool,
    pub error_message: Option<String>,

    pub avatar_asset: Option<AvatarAsset>,
    pub avatar_related_asset: Option<AvatarRelatedAsset>,
    pub world_asset: Option<WorldAsset>,
}

impl GetAssetResult {
    pub fn avatar(asset: AvatarAsset) -> Self {
        Self {
            success: true,
            error_message: None,
            avatar_asset: Some(asset),
            avatar_related_asset: None,
            world_asset: None,
        }
    }

    pub fn avatar_related(asset: AvatarRelatedAsset) -> Self {
        Self {
            success: true,
            error_message: None,
            avatar_asset: None,
            avatar_related_asset: Some(asset),
            world_asset: None,
        }
    }

    pub fn world(asset: WorldAsset) -> Self {
        Self {
            success: true,
            error_message: None,
            avatar_asset: None,
            avatar_related_asset: None,
            world_asset: Some(asset),
        }
    }

    pub fn error(error_message: String) -> Self {
        Self {
            success: false,
            error_message: Some(error_message),
            avatar_asset: None,
            avatar_related_asset: None,
            world_asset: None,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CheckForUpdateResult {
    pub success: bool,
    pub error_message: Option<String>,
    pub update_available: bool,
    pub update_version: Option<String>,
}

impl CheckForUpdateResult {
    pub fn create(
        success: bool,
        error_message: Option<String>,
        update_available: bool,
        update_version: Option<String>,
    ) -> Self {
        Self {
            success,
            error_message,
            update_available,
            update_version,
        }
    }
}
