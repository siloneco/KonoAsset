use std::path::PathBuf;

use crate::{
    preference::store::{PreferenceStore, Theme},
    updater::update_handler::UpdateChannel,
};
use monostate::MustBe;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum VersionedPreferences {
    Preference {
        version: MustBe!(3u64),
        data: PreferenceStore,
    },
    LegacyPreferenceV2 {
        version: MustBe!(2u64),
        data: LegacyPreferenceStoreV2,
    },
    LegacyPreferenceV1 {
        version: MustBe!(1u64),
        data: LegacyPreferenceStoreV1,
    },
    LegacyRawPreference(LegacyPreferenceStoreV1),
}

impl TryInto<PreferenceStore> for VersionedPreferences {
    type Error = String;

    fn try_into(self) -> Result<PreferenceStore, Self::Error> {
        match self {
            VersionedPreferences::Preference { data, .. } => Ok(data),
            VersionedPreferences::LegacyPreferenceV2 { data, .. } => Ok(data.into()),
            VersionedPreferences::LegacyPreferenceV1 { data, .. } => {
                let v2: LegacyPreferenceStoreV2 = data.into();
                Ok(v2.into())
            }
            VersionedPreferences::LegacyRawPreference(legacy_raw_preference) => {
                let v2: LegacyPreferenceStoreV2 = legacy_raw_preference.into();
                Ok(v2.into())
            }
        }
    }
}

impl TryFrom<PreferenceStore> for VersionedPreferences {
    type Error = String;

    fn try_from(value: PreferenceStore) -> Result<VersionedPreferences, Self::Error> {
        Ok(VersionedPreferences::Preference {
            version: MustBe!(3u64),
            data: value,
        })
    }
}

/*
 * Version 2
 */

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LegacyPreferenceStoreV2 {
    pub data_dir_path: PathBuf,
    pub theme: Theme,
    pub delete_on_import: bool,
    pub use_unitypackage_selected_open: bool,
}

impl Into<PreferenceStore> for LegacyPreferenceStoreV2 {
    fn into(self) -> PreferenceStore {
        PreferenceStore {
            file_path: Default::default(),
            data_dir_path: self.data_dir_path,
            theme: self.theme,
            delete_on_import: self.delete_on_import,
            use_unitypackage_selected_open: self.use_unitypackage_selected_open,
            // for beta testers
            update_channel: UpdateChannel::PreRelease,
        }
    }
}

/*
 * Version 1
 */

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

impl Into<LegacyPreferenceStoreV2> for LegacyPreferenceStoreV1 {
    fn into(self) -> LegacyPreferenceStoreV2 {
        LegacyPreferenceStoreV2 {
            data_dir_path: self.data_dir_path,
            theme: self.theme,
            delete_on_import: self.skip_confirmation.delete_file_or_dir_on_import,
            use_unitypackage_selected_open: !self
                .skip_confirmation
                .open_managed_dir_on_multiple_unitypackage_found,
        }
    }
}
