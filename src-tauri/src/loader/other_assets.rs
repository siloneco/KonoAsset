use crate::definitions::entities::OtherAsset;
use monostate::MustBe;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum VersionedOtherAssets {
    OtherAssets {
        version: MustBe!(3u64),
        data: HashSet<OtherAsset>,
    },
}

impl TryInto<HashSet<OtherAsset>> for VersionedOtherAssets {
    type Error = String;

    fn try_into(self) -> Result<HashSet<OtherAsset>, Self::Error> {
        match self {
            VersionedOtherAssets::OtherAssets { data, .. } => Ok(data),
        }
    }
}

impl TryFrom<HashSet<OtherAsset>> for VersionedOtherAssets {
    type Error = String;

    fn try_from(value: HashSet<OtherAsset>) -> Result<VersionedOtherAssets, Self::Error> {
        Ok(VersionedOtherAssets::OtherAssets {
            version: MustBe!(3u64),
            data: value,
        })
    }
}
