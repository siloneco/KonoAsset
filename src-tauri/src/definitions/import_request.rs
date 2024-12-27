use super::entities::AssetDescription;
use serde::Deserialize;
use std::collections::BTreeSet;

#[derive(Deserialize, Debug, Clone, specta::Type)]
pub struct PreAvatar {
    pub description: AssetDescription,
}

#[derive(Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct PreAvatarWearable {
    pub description: AssetDescription,
    pub category: String,
    pub supported_avatars: BTreeSet<String>,
}

#[derive(Deserialize, Debug, Clone, specta::Type)]
pub struct PreWorldObject {
    pub description: AssetDescription,
    pub category: String,
}

#[derive(Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct AvatarImportRequest {
    pub pre_asset: PreAvatar,
    pub absolute_path: String,
}

#[derive(Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct AvatarWearableImportRequest {
    pub pre_asset: PreAvatarWearable,
    pub absolute_path: String,
}

#[derive(Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct WorldObjectImportRequest {
    pub pre_asset: PreWorldObject,
    pub absolute_path: String,
}
