use serde::{Deserialize, Serialize};

use super::{
    entities::{AvatarAsset, AvatarRelatedAsset, WorldAsset},
    pre::{PreAvatarAsset, PreAvatarRelatedAsset, PreWorldAsset},
};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AvatarAssetImportRequest {
    pub pre_asset: PreAvatarAsset,
    pub file_or_dir_absolute_path: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AvatarRelatedAssetImportRequest {
    pub pre_asset: PreAvatarRelatedAsset,
    pub file_or_dir_absolute_path: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WorldAssetImportRequest {
    pub pre_asset: PreWorldAsset,
    pub file_or_dir_absolute_path: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AvatarAssetImportResult {
    pub success: bool,
    pub avatar_asset: Option<AvatarAsset>,
    pub error_message: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AvatarRelatedAssetImportResult {
    pub success: bool,
    pub avatar_related_asset: Option<AvatarRelatedAsset>,
    pub error_message: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WorldAssetImportResult {
    pub success: bool,
    pub world_asset: Option<WorldAsset>,
    pub error_message: Option<String>,
}
