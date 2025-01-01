use std::path::PathBuf;

use serde::{Deserialize, Serialize};

use crate::definitions::entities::AssetDescription;

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct LegacyAssetDescriptionV1 {
    pub name: String,
    pub creator: String,
    pub image_path: Option<String>,
    pub image_filename: Option<String>,
    pub tags: Vec<String>,
    pub booth_item_id: Option<u64>,
    pub created_at: i64,
    pub published_at: Option<i64>,
}

impl TryInto<AssetDescription> for LegacyAssetDescriptionV1 {
    type Error = String;

    fn try_into(self) -> Result<AssetDescription, Self::Error> {
        let image_filename = if let Some(image_filename) = self.image_filename {
            Some(image_filename)
        } else if let Some(image_path) = self.image_path {
            let path = PathBuf::from(image_path);
            Some(path.file_name().unwrap().to_str().unwrap().to_string())
        } else {
            None
        };

        Ok(AssetDescription {
            name: self.name,
            creator: self.creator,
            image_filename: image_filename,
            tags: self.tags,
            booth_item_id: self.booth_item_id,
            created_at: self.created_at,
            published_at: self.published_at,
        })
    }
}
