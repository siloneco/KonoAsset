use std::path::PathBuf;

use crate::preference::store::{PreferenceStore, Theme};
use monostate::MustBe;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum VersionedPreferences {
    Preference {
        version: MustBe!(2u64),
        data: PreferenceStore,
    },
    LegacyPreferenceV1 {
        version: MustBe!(1u64),
        data: LegacyPreferenceStoreV1,
    },
    LegacyRawPreference(PreferenceStore),
}

impl TryInto<PreferenceStore> for VersionedPreferences {
    type Error = String;

    fn try_into(self) -> Result<PreferenceStore, Self::Error> {
        match self {
            VersionedPreferences::Preference { data, .. } => Ok(data),
            VersionedPreferences::LegacyPreferenceV1 { data, .. } => Ok(data.into()),
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
            version: MustBe!(2u64),
            data: value,
        })
    }
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LegacyPreferenceStoreV1 {
    data_dir_path: PathBuf,
    theme: Theme,
    skip_confirmation: LegacySkipConfirmationV1,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LegacySkipConfirmationV1 {
    delete_file_or_dir_on_import: bool,
    open_managed_dir_on_multiple_unitypackage_found: bool,
}

impl Into<PreferenceStore> for LegacyPreferenceStoreV1 {
    fn into(self) -> PreferenceStore {
        PreferenceStore {
            file_path: Default::default(),
            data_dir_path: self.data_dir_path,
            theme: self.theme,
            delete_on_import: self.skip_confirmation.delete_file_or_dir_on_import,
            use_unitypackage_selected_open: !self
                .skip_confirmation
                .open_managed_dir_on_multiple_unitypackage_found,
        }
    }
}
