use model::AvatarWearable;
use monostate::MustBe;
use serde::{Deserialize, Serialize};
use std::collections::{BTreeSet, HashSet};
use uuid::Uuid;

use super::share::{LegacyAssetDescriptionV1, LegacyAssetDescriptionV2};

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum VersionedAvatarWearables {
    AvatarWearables {
        version: MustBe!(3u64),
        data: HashSet<AvatarWearable>,
    },
    LegacyAvatarWearablesV2 {
        version: MustBe!(2u64),
        data: HashSet<LegacyAvatarWearableV2>,
    },
    LegacyAvatarWearablesV1(HashSet<LegacyAvatarWearableV1>),
}

impl TryInto<HashSet<AvatarWearable>> for VersionedAvatarWearables {
    type Error = String;

    fn try_into(self) -> Result<HashSet<AvatarWearable>, Self::Error> {
        match self {
            VersionedAvatarWearables::AvatarWearables { data, .. } => Ok(data),
            VersionedAvatarWearables::LegacyAvatarWearablesV2 { data, .. } => {
                let mut avatar_wearables = HashSet::new();
                for item in data {
                    let item: AvatarWearable = item.try_into()?;

                    avatar_wearables.insert(item);
                }
                Ok(avatar_wearables)
            }
            VersionedAvatarWearables::LegacyAvatarWearablesV1(legacy_avatar_wearables) => {
                let mut avatar_wearables = HashSet::new();
                for item in legacy_avatar_wearables {
                    let item: LegacyAvatarWearableV2 = item.try_into()?;
                    let item: AvatarWearable = item.try_into()?;

                    avatar_wearables.insert(item);
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
            version: MustBe!(3u64),
            data: value,
        })
    }
}

/*
 * V2
 */

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct LegacyAvatarWearableV2 {
    pub id: Uuid,
    pub description: LegacyAssetDescriptionV2,
    pub category: String,
    pub supported_avatars: BTreeSet<String>,
}

impl TryInto<AvatarWearable> for LegacyAvatarWearableV2 {
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

/*
 * V1
 */

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct LegacyAvatarWearableV1 {
    pub id: Uuid,
    pub description: LegacyAssetDescriptionV1,
    pub category: String,
    pub supported_avatars: BTreeSet<String>,
}

impl TryInto<LegacyAvatarWearableV2> for LegacyAvatarWearableV1 {
    type Error = String;

    fn try_into(self) -> Result<LegacyAvatarWearableV2, Self::Error> {
        Ok(LegacyAvatarWearableV2 {
            id: self.id,
            description: self.description.try_into()?,
            category: self.category,
            supported_avatars: self.supported_avatars,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_legacy_avatar_wearable_v1_migration() {
        let image_path = if cfg!(target_os = "windows") {
            "C:\\path\\to\\image.png".to_string()
        } else {
            "/path/to/image.png".to_string()
        };

        let legacy = LegacyAvatarWearableV1 {
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
            category: "category".to_string(),
            supported_avatars: BTreeSet::new(),
        };

        let latest: LegacyAvatarWearableV2 = legacy.try_into().unwrap();

        assert_eq!(
            latest.description.image_filename,
            Some("image.png".to_string()),
        );
    }
}
