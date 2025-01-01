use crate::definitions::entities::WorldObject;
use monostate::MustBe;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use uuid::Uuid;

use super::share::LegacyAssetDescriptionV1;

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum VersionedWorldObjects {
    WorldObjects {
        version: MustBe!(1u64),
        data: HashSet<WorldObject>,
    },
    LegacyWorldObjectsV1(HashSet<LegacyWorldObjectV1>),
}

impl TryInto<HashSet<WorldObject>> for VersionedWorldObjects {
    type Error = String;

    fn try_into(self) -> Result<HashSet<WorldObject>, Self::Error> {
        match self {
            VersionedWorldObjects::WorldObjects { data, .. } => Ok(data),
            VersionedWorldObjects::LegacyWorldObjectsV1(legacy_world_objects) => {
                let mut world_objects = HashSet::new();
                for legacy_world_object in legacy_world_objects {
                    let world_object = legacy_world_object.try_into()?;
                    world_objects.insert(world_object);
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
            version: MustBe!(1u64),
            data: value,
        })
    }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub struct LegacyWorldObjectV1 {
    pub id: Uuid,
    pub description: LegacyAssetDescriptionV1,
    pub category: String,
}

impl TryInto<WorldObject> for LegacyWorldObjectV1 {
    type Error = String;

    fn try_into(self) -> Result<WorldObject, Self::Error> {
        Ok(WorldObject {
            id: self.id,
            description: self.description.try_into()?,
            category: self.category,
        })
    }
}
