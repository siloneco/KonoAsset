use crate::definitions::entities::Avatar;
use monostate::MustBe;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use uuid::Uuid;

use super::share::LegacyAssetDescriptionV1;

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum VersionedAvatars {
    Avatars {
        version: MustBe!(1u64),
        data: HashSet<Avatar>,
    },
    LegacyAvatarsV1(HashSet<LegacyAvatarV1>),
}

impl TryInto<HashSet<Avatar>> for VersionedAvatars {
    type Error = String;

    fn try_into(self) -> Result<HashSet<Avatar>, Self::Error> {
        match self {
            VersionedAvatars::Avatars { data, .. } => Ok(data),
            VersionedAvatars::LegacyAvatarsV1(legacy_avatars) => {
                let mut avatars = HashSet::new();
                for legacy_avatar in legacy_avatars {
                    let avatar = legacy_avatar.try_into()?;
                    avatars.insert(avatar);
                }
                Ok(avatars)
            }
        }
    }
}

impl TryFrom<HashSet<Avatar>> for VersionedAvatars {
    type Error = String;

    fn try_from(value: HashSet<Avatar>) -> Result<VersionedAvatars, Self::Error> {
        Ok(VersionedAvatars::Avatars {
            version: MustBe!(1u64),
            data: value,
        })
    }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct LegacyAvatarV1 {
    pub id: Uuid,
    pub description: LegacyAssetDescriptionV1,
}

impl TryInto<Avatar> for LegacyAvatarV1 {
    type Error = String;

    fn try_into(self) -> Result<Avatar, Self::Error> {
        Ok(Avatar {
            id: self.id,
            description: self.description.try_into()?,
        })
    }
}
