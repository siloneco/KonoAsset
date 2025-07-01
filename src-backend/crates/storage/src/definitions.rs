use model::{AssetType, Avatar, AvatarWearable, OtherAsset, WorldObject};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub enum AssetUpdatePayload {
    Avatar(Avatar),
    AvatarWearable(AvatarWearable),
    WorldObject(WorldObject),
    OtherAsset(OtherAsset),
}

#[derive(Serialize, Deserialize, Debug, Eq, PartialEq, Clone, specta::Type)]
pub enum MatchType {
    AND,
    OR,
}

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct FilterRequest {
    pub asset_type: Option<AssetType>,
    pub query_text: Option<String>,
    pub categories: Option<Vec<String>>,
    pub tags: Option<Vec<String>>,
    pub tag_match_type: MatchType,
    pub supported_avatars: Option<Vec<String>>,
    pub supported_avatar_match_type: MatchType,
}
