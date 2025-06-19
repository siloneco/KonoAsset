use uuid::Uuid;

use crate::base::{AssetDescription, AssetType, Avatar, AvatarWearable, OtherAsset, WorldObject};

pub trait AssetTrait {
    fn filename() -> String;
    fn asset_type() -> AssetType;

    fn get_id(&self) -> Uuid;
    fn set_id(&mut self, id: Uuid);
    fn get_description(&self) -> &AssetDescription;
    fn get_description_as_mut(&mut self) -> &mut AssetDescription;
}

impl AssetTrait for Avatar {
    fn filename() -> String {
        "avatars.json".into()
    }

    fn asset_type() -> AssetType {
        AssetType::Avatar
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn set_id(&mut self, id: Uuid) {
        self.id = id;
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }

    fn get_description_as_mut(&mut self) -> &mut AssetDescription {
        &mut self.description
    }
}

impl AssetTrait for AvatarWearable {
    fn filename() -> String {
        "avatarWearables.json".into()
    }

    fn asset_type() -> AssetType {
        AssetType::AvatarWearable
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn set_id(&mut self, id: Uuid) {
        self.id = id;
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }

    fn get_description_as_mut(&mut self) -> &mut AssetDescription {
        &mut self.description
    }
}

impl AssetTrait for WorldObject {
    fn filename() -> String {
        "worldObjects.json".into()
    }

    fn asset_type() -> AssetType {
        AssetType::WorldObject
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn set_id(&mut self, id: Uuid) {
        self.id = id;
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }

    fn get_description_as_mut(&mut self) -> &mut AssetDescription {
        &mut self.description
    }
}

impl AssetTrait for OtherAsset {
    fn filename() -> String {
        "otherAssets.json".into()
    }

    fn asset_type() -> AssetType {
        AssetType::OtherAsset
    }

    fn get_id(&self) -> Uuid {
        self.id
    }

    fn set_id(&mut self, id: Uuid) {
        self.id = id;
    }

    fn get_description(&self) -> &AssetDescription {
        &self.description
    }

    fn get_description_as_mut(&mut self) -> &mut AssetDescription {
        &mut self.description
    }
}
