use serde::{Deserialize, Serialize};

use super::entities::{AssetDescription, AssetType};

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
