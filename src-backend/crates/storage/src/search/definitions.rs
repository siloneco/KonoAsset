use std::collections::BTreeSet;

use model::{AssetDescription, AssetType, Avatar, AvatarWearable, OtherAsset, WorldObject};
use uuid::Uuid;

pub struct FilterOptimizedAssets<'a> {
    pub id: &'a Uuid,
    pub asset_type: AssetType,
    pub description: &'a AssetDescription,
    pub category: OptionalFeature<Option<&'a str>>,
    pub supported_avatars: OptionalFeature<&'a BTreeSet<String>>,
}

pub enum OptionalFeature<T> {
    Implemented(T),
    None,
}

impl<'a> From<&'a Avatar> for FilterOptimizedAssets<'a> {
    fn from(avatar: &'a Avatar) -> Self {
        Self {
            id: &avatar.id,
            asset_type: AssetType::Avatar,
            description: &avatar.description,
            category: OptionalFeature::None,
            supported_avatars: OptionalFeature::None,
        }
    }
}

impl<'a> From<&'a AvatarWearable> for FilterOptimizedAssets<'a> {
    fn from(avatar_wearable: &'a AvatarWearable) -> Self {
        let category = if avatar_wearable.category.is_empty() {
            OptionalFeature::Implemented(None)
        } else {
            OptionalFeature::Implemented(Some(avatar_wearable.category.as_ref()))
        };

        Self {
            id: &avatar_wearable.id,
            asset_type: AssetType::AvatarWearable,
            description: &avatar_wearable.description,
            category,
            supported_avatars: OptionalFeature::Implemented(&avatar_wearable.supported_avatars),
        }
    }
}

impl<'a> From<&'a WorldObject> for FilterOptimizedAssets<'a> {
    fn from(world_object: &'a WorldObject) -> Self {
        let category = if world_object.category.is_empty() {
            OptionalFeature::Implemented(None)
        } else {
            OptionalFeature::Implemented(Some(world_object.category.as_ref()))
        };

        Self {
            id: &world_object.id,
            asset_type: AssetType::WorldObject,
            description: &world_object.description,
            category,
            supported_avatars: OptionalFeature::None,
        }
    }
}

impl<'a> From<&'a OtherAsset> for FilterOptimizedAssets<'a> {
    fn from(other_asset: &'a OtherAsset) -> Self {
        let category = if other_asset.category.is_empty() {
            OptionalFeature::Implemented(None)
        } else {
            OptionalFeature::Implemented(Some(other_asset.category.as_ref()))
        };

        Self {
            id: &other_asset.id,
            asset_type: AssetType::OtherAsset,
            description: &other_asset.description,
            category,
            supported_avatars: OptionalFeature::None,
        }
    }
}
