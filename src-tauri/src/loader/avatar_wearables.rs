use crate::definitions::entities::AvatarWearable;
use monostate::MustBe;
use serde::{Deserialize, Serialize};
use std::collections::{BTreeSet, HashSet};
use uuid::Uuid;

use super::share::LegacyAssetDescriptionV1;

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum VersionedAvatarWearables {
    AvatarWearables {
        version: MustBe!(1u64),
        data: HashSet<AvatarWearable>,
    },
    LegacyAvatarWearablesV1(HashSet<LegacyAvatarWearableV1>),
}

impl TryInto<HashSet<AvatarWearable>> for VersionedAvatarWearables {
    type Error = String;

    fn try_into(self) -> Result<HashSet<AvatarWearable>, Self::Error> {
        match self {
            VersionedAvatarWearables::AvatarWearables { data, .. } => Ok(data),
            VersionedAvatarWearables::LegacyAvatarWearablesV1(legacy_avatar_wearables) => {
                let mut avatar_wearables = HashSet::new();
                for legacy_avatar_wearable in legacy_avatar_wearables {
                    let avatar_wearable = legacy_avatar_wearable.try_into()?;
                    avatar_wearables.insert(avatar_wearable);
                }
                Ok(avatar_wearables)
            }
        }
    }
}

impl TryFrom<HashSet<AvatarWearable>> for VersionedAvatarWearables {
    type Error = String;

    fn try_from(value: HashSet<AvatarWearable>) -> Result<VersionedAvatarWearables, Self::Error> {
        Ok(VersionedAvatarWearables::AvatarWearables {
            version: MustBe!(1u64),
            data: value,
        })
    }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct LegacyAvatarWearableV1 {
    pub id: Uuid,
    pub description: LegacyAssetDescriptionV1,
    pub category: String,
    pub supported_avatars: BTreeSet<String>,
}

impl TryInto<AvatarWearable> for LegacyAvatarWearableV1 {
    type Error = String;

    fn try_into(self) -> Result<AvatarWearable, Self::Error> {
        Ok(AvatarWearable {
            id: self.id,
            description: self.description.try_into()?,
            category: self.category,
            supported_avatars: self.supported_avatars,
        })
    }
}
