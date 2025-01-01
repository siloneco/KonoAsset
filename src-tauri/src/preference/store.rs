use std::{io, path::PathBuf};

use serde::{Deserialize, Serialize};
use tauri::{App, Manager};

use crate::loader::VersionedPreferences;

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct PreferenceStore {
    #[serde(skip)]
    file_path: PathBuf,

    data_dir_path: PathBuf,
    theme: Theme,
    skip_confirmation: SkipConfirmation,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct SkipConfirmation {
    delete_file_or_dir_on_import: bool,
    open_managed_dir_on_multiple_unitypackage_found: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy, specta::Type)]
pub enum Theme {
    #[serde(rename = "light")]
    Light,
    #[serde(rename = "dark")]
    Dark,
    #[serde(rename = "system")]
    System,
}

impl PreferenceStore {
    pub fn default(app: &App) -> Self {
        let mut file_path = app.path().app_local_data_dir().unwrap();
        file_path.push("preference.json");

        let data_dir_path = app.path().app_local_data_dir().unwrap();

        // // 将来的にはこれをデフォルトにする
        // let mut data_dir_path = app.path().document_dir().unwrap();
        // data_dir_path.push("KonoAsset");

        Self {
            file_path: file_path,

            data_dir_path: data_dir_path,
            theme: Theme::System,
            skip_confirmation: SkipConfirmation::default(),
        }
    }

    pub fn load(app: &App) -> Result<Option<Self>, io::Error> {
        let mut preference_json_path = app.path().app_local_data_dir().unwrap();
        preference_json_path.push("preference.json");

        if !preference_json_path.exists() {
            return Ok(None);
        }

        let reader = std::fs::File::open(preference_json_path)?;
        let preference: Result<PreferenceStore, _> =
            serde_json::from_reader::<_, VersionedPreferences>(reader)?.try_into();

        if let Err(e) = preference {
            eprintln!("Failed to load preference: {}", e);
            return Ok(None);
        }

        let mut preference = preference.unwrap();

        let mut file_path = app.path().app_local_data_dir().unwrap();
        file_path.push("preference.json");

        preference.file_path = file_path;

        Ok(Some(preference))
    }

    pub fn get_data_dir(&self) -> &PathBuf {
        &self.data_dir_path
    }

    pub fn set_data_dir(&mut self, data_dir_path: PathBuf) {
        self.data_dir_path = data_dir_path;
    }

    pub fn overwrite(&mut self, other: &Self) {
        self.data_dir_path = other.data_dir_path.clone();
        self.theme = other.theme;
        self.skip_confirmation = other.skip_confirmation;
    }

    pub fn save(&self) -> Result<(), io::Error> {
        let writer = std::fs::File::create(&self.file_path)?;

        let versioned = VersionedPreferences::try_from(self.clone());

        if let Err(e) = versioned {
            eprintln!("Failed to save preference: {}", e);
            return Ok(());
        }

        serde_json::to_writer(writer, &versioned.unwrap())?;

        Ok(())
    }
}

impl SkipConfirmation {
    pub fn default() -> Self {
        Self {
            delete_file_or_dir_on_import: false,
            open_managed_dir_on_multiple_unitypackage_found: false,
        }
    }
}
