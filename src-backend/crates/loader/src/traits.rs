use std::collections::HashSet;

use model::{Avatar, AvatarWearable, OtherAsset, WorldObject};
use serde::{Serialize, de::DeserializeOwned};

use crate::{
    VersionedAvatarWearables, VersionedAvatars, VersionedOtherAssets, VersionedWorldObjects,
};

pub trait HashSetVersionedLoader<T> {
    type VersionedType: Serialize
        + DeserializeOwned
        + TryInto<HashSet<T>, Error = String>
        + TryFrom<HashSet<T>, Error = String>;
}

impl HashSetVersionedLoader<Avatar> for Avatar {
    type VersionedType = VersionedAvatars;
}

impl HashSetVersionedLoader<AvatarWearable> for AvatarWearable {
    type VersionedType = VersionedAvatarWearables;
}

impl HashSetVersionedLoader<WorldObject> for WorldObject {
    type VersionedType = VersionedWorldObjects;
}

impl HashSetVersionedLoader<OtherAsset> for OtherAsset {
    type VersionedType = VersionedOtherAssets;
}
