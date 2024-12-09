use serde::{Deserialize, Serialize};

use super::entities::{AssetCategory, AssetTag, AssetType};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PreAssetItem {
    pub title: String,
    pub author: String,
    pub types: Vec<AssetType>,
    pub image_src: String,
    pub category: AssetCategory,
    pub asset_dirs: Vec<String>,
    pub tags: Vec<AssetTag>,
}

impl PreAssetItem {
    pub fn create(
        title: String,
        author: String,
        types: Vec<AssetType>,
        image_src: String,
        category: AssetCategory,
        asset_dirs: Vec<String>,
        tags: Vec<AssetTag>,
    ) -> Self {
        Self {
            title,
            author,
            types,
            image_src,
            category,
            asset_dirs,
            tags,
        }
    }
}
