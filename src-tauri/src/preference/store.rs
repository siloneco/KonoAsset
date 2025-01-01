use std::{io, path::PathBuf};

use serde::{Deserialize, Serialize};
use tauri::{App, Manager};

use crate::loader::VersionedPreferences;

#[derive(Serialize, Deserialize, Debug, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct PreferenceStore {
    #[serde(skip)]
    pub file_path: PathBuf,

    pub data_dir_path: PathBuf,
    pub theme: Theme,

    pub delete_on_import: bool,
    pub use_unitypackage_selected_open: bool,
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

            delete_on_import: true,
            use_unitypackage_selected_open: true,
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
        self.delete_on_import = other.delete_on_import;
        self.use_unitypackage_selected_open = other.use_unitypackage_selected_open;
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
