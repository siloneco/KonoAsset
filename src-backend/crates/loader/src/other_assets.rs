use model::OtherAsset;
use monostate::MustBe;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;

use crate::adapters::OtherAssetJsonAdapter;

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum VersionedOtherAssets {
    OtherAssets {
        version: MustBe!(3u64),
        data: HashSet<OtherAssetJsonAdapter>,
    },
}

impl TryInto<HashSet<OtherAsset>> for VersionedOtherAssets {
    type Error = String;

    fn try_into(self) -> Result<HashSet<OtherAsset>, Self::Error> {
        match self {
            VersionedOtherAssets::OtherAssets { data, .. } => {
                Ok(data.into_iter().map(|adapter| adapter.into()).collect())
            }
        }
    }
}

impl TryFrom<HashSet<OtherAsset>> for VersionedOtherAssets {
    type Error = String;

    fn try_from(value: HashSet<OtherAsset>) -> Result<VersionedOtherAssets, Self::Error> {
        Ok(VersionedOtherAssets::OtherAssets {
            version: MustBe!(3u64),
            data: value
                .into_iter()
                .map(|other_asset| other_asset.into())
                .collect(),
        })
    }
}
