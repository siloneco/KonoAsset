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
    pub categories: Option<FilterElement<FilterRequirement<String>>>,
    pub tags: Option<FilterElement<FilterRequirement<String>>>,
    pub supported_avatars: Option<FilterElement<FilterRequirement<String>>>,
}

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(tag = "type", content = "data")]
pub enum FilterElement<T> {
    AND(Vec<T>),
    OR(Vec<T>),
    Unlabeled,
}

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(tag = "type", content = "data")]
pub enum FilterRequirement<T> {
    Include(T),
    Exclude(T),
}

impl<T> FilterRequirement<T> {
    pub fn value(&self) -> &T {
        match self {
            FilterRequirement::Include(value) => value,
            FilterRequirement::Exclude(value) => value,
        }
    }
}
