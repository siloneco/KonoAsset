use model::preference::{LanguageCode, PreferenceStore, Theme, UpdateChannel};
use std::path::PathBuf;

use monostate::MustBe;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum VersionedPreferences {
    Preference {
        version: MustBe!(5u64),
        data: PreferenceStore,
    },
    LegacyPreferenceV4 {
        version: MustBe!(4u64),
        data: LegacyPreferenceStoreV4,
    },
    LegacyPreferenceV3 {
        version: MustBe!(3u64),
        data: LegacyPreferenceStoreV3,
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
            VersionedPreferences::LegacyPreferenceV4 { data, .. } => Ok(data.into()),
            VersionedPreferences::LegacyPreferenceV3 { data, .. } => {
                let data: LegacyPreferenceStoreV4 = data.into();
                Ok(data.into())
            }
            VersionedPreferences::LegacyPreferenceV2 { data, .. } => {
                let data: LegacyPreferenceStoreV3 = data.into();
                let data: LegacyPreferenceStoreV4 = data.into();
                Ok(data.into())
            }
            VersionedPreferences::LegacyPreferenceV1 { data, .. } => {
                let data: LegacyPreferenceStoreV2 = data.into();
                let data: LegacyPreferenceStoreV3 = data.into();
                let data: LegacyPreferenceStoreV4 = data.into();
                Ok(data.into())
            }
            VersionedPreferences::LegacyRawPreference(legacy_raw_preference) => {
                let data: LegacyPreferenceStoreV2 = legacy_raw_preference.into();
                let data: LegacyPreferenceStoreV3 = data.into();
                let data: LegacyPreferenceStoreV4 = data.into();
                Ok(data.into())
            }
        }
    }
}

impl TryFrom<PreferenceStore> for VersionedPreferences {
    type Error = String;

    fn try_from(value: PreferenceStore) -> Result<VersionedPreferences, Self::Error> {
        Ok(VersionedPreferences::Preference {
            version: MustBe!(5u64),
            data: value,
        })
    }
}

/*
 * Version 4
 */

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LegacyPreferenceStoreV4 {
    pub data_dir_path: PathBuf,
    pub theme: Theme,
    pub language: LanguageCode,
    pub delete_on_import: bool,
    pub use_unitypackage_selected_open: bool,
    pub update_channel: UpdateChannel,
}

impl Into<PreferenceStore> for LegacyPreferenceStoreV4 {
    fn into(self) -> PreferenceStore {
        PreferenceStore {
            file_path: Default::default(),
            data_dir_path: self.data_dir_path,
            theme: self.theme,
            language: self.language,
            delete_on_import: self.delete_on_import,
            zip_extraction: true,
            use_unitypackage_selected_open: self.use_unitypackage_selected_open,
            update_channel: self.update_channel,
        }
    }
}

/*
 * Version 3
 */

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LegacyPreferenceStoreV3 {
    pub data_dir_path: PathBuf,
    pub theme: Theme,
    pub delete_on_import: bool,
    pub use_unitypackage_selected_open: bool,
    pub update_channel: UpdateChannel,
}

impl Into<LegacyPreferenceStoreV4> for LegacyPreferenceStoreV3 {
    fn into(self) -> LegacyPreferenceStoreV4 {
        LegacyPreferenceStoreV4 {
            data_dir_path: self.data_dir_path,
            theme: self.theme,
            language: LanguageCode::JaJp,
            delete_on_import: self.delete_on_import,
            use_unitypackage_selected_open: self.use_unitypackage_selected_open,
            update_channel: self.update_channel,
        }
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

impl Into<LegacyPreferenceStoreV3> for LegacyPreferenceStoreV2 {
    fn into(self) -> LegacyPreferenceStoreV3 {
        LegacyPreferenceStoreV3 {
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
