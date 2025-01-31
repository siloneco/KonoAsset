use super::{
    entities::{AssetDescription, Avatar, AvatarWearable, WorldObject},
    traits::AssetTrait,
};
use serde::Deserialize;
use std::collections::BTreeSet;

#[derive(Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct AssetImportRequest<T: PreAsset> {
    pub pre_asset: T,
    pub absolute_paths: Vec<String>,
    pub delete_source: bool,
}

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

pub trait PreAsset {
    type AssetType: AssetTrait + Clone;

    fn description(&mut self) -> &mut AssetDescription;
    fn create(&self) -> Self::AssetType;
}

impl PreAsset for PreAvatar {
    type AssetType = Avatar;

    fn description(&mut self) -> &mut AssetDescription {
        &mut self.description
    }

    fn create(&self) -> Self::AssetType {
        Avatar::create(self.description.clone())
    }
}

impl PreAsset for PreAvatarWearable {
    type AssetType = AvatarWearable;

    fn description(&mut self) -> &mut AssetDescription {
        &mut self.description
    }

    fn create(&self) -> Self::AssetType {
        AvatarWearable::create(
            self.description.clone(),
            self.category.clone(),
            self.supported_avatars.clone(),
        )
    }
}

impl PreAsset for PreWorldObject {
    type AssetType = WorldObject;

    fn description(&mut self) -> &mut AssetDescription {
        &mut self.description
    }

    fn create(&self) -> Self::AssetType {
        WorldObject::create(self.description.clone(), self.category.clone())
    }
}
