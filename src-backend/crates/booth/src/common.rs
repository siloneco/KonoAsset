use std::time::Duration;

use model::AssetType;
use serde::Serialize;

pub fn get_reqwest_client<S: AsRef<str>>(version: S) -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .user_agent(format!("KonoAsset/{}", version.as_ref()))
        .timeout(Duration::from_secs(5))
        .build()
        .map_err(|e| format!("Failed to create reqwest client: {}", e))
}

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

impl BoothAssetInfo {
    pub fn new(
        id: u64,
        name: String,
        creator: String,
        image_urls: Vec<String>,
        published_at: i64,
        estimated_asset_type: Option<AssetType>,
    ) -> Self {
        Self {
            id,
            name,
            creator,
            image_urls,
            published_at,
            estimated_asset_type,
        }
    }
}
