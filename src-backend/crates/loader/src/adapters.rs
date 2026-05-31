use std::collections::BTreeSet;

use model::{AssetDescription, Avatar, AvatarWearable, OtherAsset, WorldObject};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/*
 * JSON Adapter
 *
 * Because of specta's requirements, we need to handle i64 as a string type,
 * but we want to store it as a numeric value in JSON.
 */
#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct AssetDescriptionJsonAdapter {
    pub name: String,
    pub creator: String,
    pub image_filename: Option<String>,
    pub tags: Vec<String>,
    pub memo: Option<String>,
    pub booth_item_id: Option<u32>,
    pub dependencies: Vec<Uuid>,
    pub created_at: i64,
    pub published_at: Option<i64>,
}

impl Into<AssetDescription> for AssetDescriptionJsonAdapter {
    fn into(self) -> AssetDescription {
        AssetDescription {
            name: self.name,
            creator: self.creator,
            image_filename: self.image_filename,
            tags: self.tags,
            memo: self.memo,
            booth_item_id: self.booth_item_id,
            dependencies: self.dependencies,
            created_at: self.created_at,
            published_at: self.published_at,
        }
    }
}

impl From<AssetDescription> for AssetDescriptionJsonAdapter {
    fn from(description: AssetDescription) -> Self {
        Self {
            name: description.name,
            creator: description.creator,
            image_filename: description.image_filename,
            tags: description.tags,
            memo: description.memo,
            booth_item_id: description.booth_item_id,
            dependencies: description.dependencies,
            created_at: description.created_at,
            published_at: description.published_at,
        }
    }
}

/*
* Avatar JSON Adapter
*/
#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct AvatarJsonAdapter {
    pub id: Uuid,
    pub description: AssetDescriptionJsonAdapter,
}

impl Into<Avatar> for AvatarJsonAdapter {
    fn into(self) -> Avatar {
        Avatar {
            id: self.id,
            description: self.description.into(),
        }
    }
}

impl From<Avatar> for AvatarJsonAdapter {
    fn from(avatar: Avatar) -> Self {
        Self {
            id: avatar.id,
            description: avatar.description.into(),
        }
    }
}

/*
* Avatar Wearable JSON Adapter
*/
#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct AvatarWearableJsonAdapter {
    pub id: Uuid,
    pub description: AssetDescriptionJsonAdapter,
    pub category: String,
    pub supported_avatars: BTreeSet<String>,
}

impl Into<AvatarWearable> for AvatarWearableJsonAdapter {
    fn into(self) -> AvatarWearable {
        AvatarWearable {
            id: self.id,
            description: self.description.into(),
            category: self.category,
            supported_avatars: self.supported_avatars.into(),
        }
    }
}

impl From<AvatarWearable> for AvatarWearableJsonAdapter {
    fn from(avatar_wearable: AvatarWearable) -> Self {
        Self {
            id: avatar_wearable.id,
            description: avatar_wearable.description.into(),
            category: avatar_wearable.category,
            supported_avatars: avatar_wearable.supported_avatars.into(),
        }
    }
}

/*
* World Object JSON Adapter
*/
#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct WorldObjectJsonAdapter {
    pub id: Uuid,
    pub description: AssetDescriptionJsonAdapter,
    pub category: String,
}

impl Into<WorldObject> for WorldObjectJsonAdapter {
    fn into(self) -> WorldObject {
        WorldObject {
            id: self.id,
            description: self.description.into(),
            category: self.category,
        }
    }
}

impl From<WorldObject> for WorldObjectJsonAdapter {
    fn from(world_object: WorldObject) -> Self {
        Self {
            id: world_object.id,
            description: world_object.description.into(),
            category: world_object.category,
        }
    }
}

/*
* Other Asset JSON Adapter
*/
#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct OtherAssetJsonAdapter {
    pub id: Uuid,
    pub description: AssetDescriptionJsonAdapter,
    pub category: String,
}

impl Into<OtherAsset> for OtherAssetJsonAdapter {
    fn into(self) -> OtherAsset {
        OtherAsset {
            id: self.id,
            description: self.description.into(),
            category: self.category,
        }
    }
}

impl From<OtherAsset> for OtherAssetJsonAdapter {
    fn from(other_asset: OtherAsset) -> Self {
        Self {
            id: other_asset.id,
            description: other_asset.description.into(),
            category: other_asset.category,
        }
    }
}
