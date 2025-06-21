use model::WorldObject;
use monostate::MustBe;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use uuid::Uuid;

use super::share::{LegacyAssetDescriptionV1, LegacyAssetDescriptionV2};

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum VersionedWorldObjects {
    WorldObjects {
        version: MustBe!(3u64),
        data: HashSet<WorldObject>,
    },
    LegacyWorldObjectV2 {
        version: MustBe!(2u64),
        data: HashSet<LegacyWorldObjectV2>,
    },
    LegacyWorldObjectsV1(HashSet<LegacyWorldObjectV1>),
}

impl TryInto<HashSet<WorldObject>> for VersionedWorldObjects {
    type Error = String;

    fn try_into(self) -> Result<HashSet<WorldObject>, Self::Error> {
        match self {
            VersionedWorldObjects::WorldObjects { data, .. } => Ok(data),
            VersionedWorldObjects::LegacyWorldObjectV2 { data, .. } => {
                let mut world_objects = HashSet::new();
                for item in data {
                    let item: WorldObject = item.try_into()?;

                    world_objects.insert(item);
                }
                Ok(world_objects)
            }
            VersionedWorldObjects::LegacyWorldObjectsV1(legacy_world_objects) => {
                let mut world_objects = HashSet::new();
                for item in legacy_world_objects {
                    let item: LegacyWorldObjectV2 = item.try_into()?;
                    let item: WorldObject = item.try_into()?;

                    world_objects.insert(item);
                }
                Ok(world_objects)
            }
        }
    }
}

impl TryFrom<HashSet<WorldObject>> for VersionedWorldObjects {
    type Error = String;

    fn try_from(value: HashSet<WorldObject>) -> Result<VersionedWorldObjects, Self::Error> {
        Ok(VersionedWorldObjects::WorldObjects {
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
pub struct LegacyWorldObjectV2 {
    pub id: Uuid,
    pub description: LegacyAssetDescriptionV2,
    pub category: String,
}

impl TryInto<WorldObject> for LegacyWorldObjectV2 {
    type Error = String;

    fn try_into(self) -> Result<WorldObject, Self::Error> {
        Ok(WorldObject {
            id: self.id,
            description: self.description.try_into()?,
            category: self.category,
        })
    }
}

/*
 * V1
 */

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct LegacyWorldObjectV1 {
    pub id: Uuid,
    pub description: LegacyAssetDescriptionV1,
    pub category: String,
}

impl TryInto<LegacyWorldObjectV2> for LegacyWorldObjectV1 {
    type Error = String;

    fn try_into(self) -> Result<LegacyWorldObjectV2, Self::Error> {
        Ok(LegacyWorldObjectV2 {
            id: self.id,
            description: self.description.try_into()?,
            category: self.category,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_legacy_world_object_v1_migration() {
        let image_path = if cfg!(target_os = "windows") {
            "C:\\path\\to\\image.png".to_string()
        } else {
            "/path/to/image.png".to_string()
        };

        let legacy = LegacyWorldObjectV1 {
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
        };

        let latest: LegacyWorldObjectV2 = legacy.try_into().unwrap();

        assert_eq!(
            latest.description.image_filename,
            Some("image.png".to_string()),
        );
    }
}
