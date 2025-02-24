use std::{io, path::PathBuf};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

use crate::{
    language::structs::LanguageCode, loader::VersionedPreferences,
    updater::update_handler::UpdateChannel,
};

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct PreferenceStore {
    #[serde(skip)]
    pub file_path: PathBuf,

    pub data_dir_path: PathBuf,
    pub theme: Theme,
    pub language: LanguageCode,

    pub delete_on_import: bool,
    pub use_unitypackage_selected_open: bool,

    pub update_channel: UpdateChannel,
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
    pub fn default(app: &AppHandle) -> Result<Self, String> {
        let app_local_data_dir = app.path().app_local_data_dir();
        if let Err(e) = app_local_data_dir {
            return Err(format!("Failed to get app local data dir: {}", e));
        }

        let app_local_data_dir = app_local_data_dir.unwrap();
        let preference_file_path = app_local_data_dir.join("preference.json");

        let data_dir_path = app.path().document_dir().unwrap().join("KonoAsset");

        Ok(Self {
            file_path: preference_file_path,

            data_dir_path,
            theme: Theme::System,
            language: LanguageCode::EnUs,

            delete_on_import: true,
            use_unitypackage_selected_open: true,

            update_channel: UpdateChannel::Stable,
        })
    }

    pub fn load(app: &AppHandle) -> Result<Option<Self>, io::Error> {
        let app_local_data_dir = app.path().app_local_data_dir().map_err(|e| {
            io::Error::new(
                io::ErrorKind::Other,
                format!("Failed to get app local data dir: {}", e),
            )
        })?;

        let preference_json_path = app_local_data_dir.join("preference.json");

        if !preference_json_path.exists() {
            return Ok(None);
        }

        let reader = std::fs::File::open(&preference_json_path)?;
        let preference: Result<PreferenceStore, _> =
            serde_json::from_reader::<_, VersionedPreferences>(reader)?.try_into();

        if let Err(e) = preference {
            log::error!("Failed to load preference: {}", e);
            return Ok(None);
        }

        let mut preference = preference.unwrap();
        preference.file_path = preference_json_path;

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
        self.delete_on_import = other.delete_on_import;
        self.use_unitypackage_selected_open = other.use_unitypackage_selected_open;
        self.update_channel = other.update_channel;
    }

    pub fn save(&self) -> Result<(), io::Error> {
        let writer = std::fs::File::create(&self.file_path)?;

        let versioned = VersionedPreferences::try_from(self.clone());

        if let Err(e) = versioned {
            log::error!("Failed to save preference: {}", e);
            return Ok(());
        }
        let versioned = versioned.unwrap();

        serde_json::to_writer(writer, &versioned)?;

        Ok(())
    }
}
