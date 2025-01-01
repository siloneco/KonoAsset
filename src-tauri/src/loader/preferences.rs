use crate::preference::store::PreferenceStore;
use monostate::MustBe;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum VersionedPreferences {
    Preference {
        version: MustBe!(1u64),
        data: PreferenceStore,
    },
    LegacyRawPreference(PreferenceStore),
}

impl TryInto<PreferenceStore> for VersionedPreferences {
    type Error = String;

    fn try_into(self) -> Result<PreferenceStore, Self::Error> {
        match self {
            VersionedPreferences::Preference { data, .. } => Ok(data),
            VersionedPreferences::LegacyRawPreference(legacy_raw_preference) => {
                Ok(legacy_raw_preference)
            }
        }
    }
}

impl TryFrom<PreferenceStore> for VersionedPreferences {
    type Error = String;

    fn try_from(value: PreferenceStore) -> Result<VersionedPreferences, Self::Error> {
        Ok(VersionedPreferences::Preference {
            version: MustBe!(1u64),
            data: value,
        })
    }
}
