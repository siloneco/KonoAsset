use std::path::PathBuf;

use serde::{Deserialize, Serialize};

use crate::definitions::entities::AssetDescription;

/*
 * V2
 */
#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct LegacyAssetDescriptionV2 {
    pub name: String,
    pub creator: String,
    pub image_filename: Option<String>,
    pub tags: Vec<String>,
    pub memo: Option<String>,
    pub booth_item_id: Option<u64>,
    pub created_at: i64,
    pub published_at: Option<i64>,
}

impl TryInto<AssetDescription> for LegacyAssetDescriptionV2 {
    type Error = String;

    fn try_into(self) -> Result<AssetDescription, Self::Error> {
        Ok(AssetDescription {
            name: self.name,
            creator: self.creator,
            image_filename: self.image_filename,
            tags: self.tags,
            memo: self.memo,
            booth_item_id: self.booth_item_id,
            dependencies: vec![],
            created_at: self.created_at,
            published_at: self.published_at,
        })
    }
}

/*
 * V1
 */
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

impl TryInto<LegacyAssetDescriptionV2> for LegacyAssetDescriptionV1 {
    type Error = String;

    fn try_into(self) -> Result<LegacyAssetDescriptionV2, Self::Error> {
        let image_filename = if let Some(image_filename) = self.image_filename {
            Some(image_filename)
        } else if let Some(image_path) = self.image_path {
            let path = PathBuf::from(image_path);

            let file_name = path.file_name();
            if file_name.is_none() {
                return Err("Image path has no file name".to_string());
            }

            let file_name = file_name.unwrap().to_str();
            if file_name.is_none() {
                return Err("Image path file name is not valid UTF-8".to_string());
            }

            Some(file_name.unwrap().to_string())
        } else {
            None
        };

        Ok(LegacyAssetDescriptionV2 {
            name: self.name,
            creator: self.creator,
            image_filename: image_filename,
            tags: self.tags,
            memo: None,
            booth_item_id: self.booth_item_id,
            created_at: self.created_at,
            published_at: self.published_at,
        })
    }
}
