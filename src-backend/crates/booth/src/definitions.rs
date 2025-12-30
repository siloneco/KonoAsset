use model::AssetType;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Clone, Debug, PartialEq, Eq, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct BoothAssetInfo {
    pub id: u64,
    pub name: String,
    pub creator: String,
    pub image_urls: Vec<String>,
    pub published_at: i64,
    pub estimated_asset_type: Option<AssetType>,
}

#[derive(Deserialize)]
pub(crate) struct BoothJsonSchema {
    pub name: String,
    pub shop: BoothShop,
    pub images: Vec<BoothPximg>,
    pub category: BoothCategory,
    pub published_at: String,
}

#[derive(Deserialize)]
pub(crate) struct BoothShop {
    pub name: String,
}

#[derive(Deserialize)]
pub(crate) struct BoothPximg {
    pub original: String,
}

#[derive(Deserialize)]
pub(crate) struct BoothCategory {
    pub id: i32,
}
