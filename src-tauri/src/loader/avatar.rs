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
        version: MustBe!(2u64),
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
            version: MustBe!(2u64),
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_legacy_avatar_v1_migration() {
        let image_path = if cfg!(target_os = "windows") {
            "C:\\path\\to\\image.png".to_string()
        } else {
            "/path/to/image.png".to_string()
        };

        let legacy = LegacyAvatarV1 {
            id: Uuid::new_v4(),
            description: LegacyAssetDescriptionV1 {
                name: "name".into(),
                creator: "creator".into(),
                image_path: Some(image_path),
                image_filename: None,
                booth_item_id: Some(123),
                tags: vec!["tag".into()],
                created_at: 12345,
                published_at: Some(67890),
            },
        };

        let latest: Avatar = legacy.try_into().unwrap();

        assert_eq!(
            latest.description.image_filename,
            Some("image.png".to_string()),
        );
    }
}
