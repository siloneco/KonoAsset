use std::{
    io,
    path::{Path, PathBuf},
};

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

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, specta::Type)]
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
        let document_dir = app.path().document_dir();

        if let Err(e) = app_local_data_dir {
            return Err(format!("Failed to get app local data dir: {}", e));
        }
        if let Err(e) = document_dir {
            return Err(format!("Failed to get document dir: {}", e));
        }

        let preference_file_path = app_local_data_dir.unwrap().join("preference.json");
        let data_dir_path = document_dir.unwrap().join("KonoAsset");

        Ok(PreferenceStore::default_internal(
            &preference_file_path,
            &data_dir_path,
        ))
    }

    fn default_internal<P, Q>(preference_file_path: P, data_dir_path: Q) -> Self
    where
        P: AsRef<Path>,
        Q: AsRef<Path>,
    {
        let file_path = preference_file_path.as_ref().to_path_buf();
        let data_dir_path = data_dir_path.as_ref().to_path_buf();

        Self {
            file_path,

            data_dir_path,
            theme: Theme::System,
            language: LanguageCode::JaJp,

            delete_on_import: false,
            use_unitypackage_selected_open: true,

            update_channel: UpdateChannel::Stable,
        }
    }

    pub fn load(app: &AppHandle) -> Result<Option<Self>, io::Error> {
        let app_local_data_dir = app.path().app_local_data_dir().map_err(|e| {
            io::Error::new(
                io::ErrorKind::Other,
                format!("Failed to get app local data dir: {}", e),
            )
        })?;

        let preference_json_path = app_local_data_dir.join("preference.json");

        PreferenceStore::load_internal(preference_json_path)
    }

    fn load_internal<P: AsRef<Path>>(path: P) -> Result<Option<Self>, io::Error> {
        let path = path.as_ref();

        if !path.exists() {
            return Ok(None);
        }

        let reader = std::fs::File::open(&path)?;
        let preference: Result<PreferenceStore, _> =
            serde_json::from_reader::<_, VersionedPreferences>(reader)?.try_into();

        if let Err(e) = preference {
            log::error!("Failed to load preference: {}", e);
            return Ok(None);
        }

        let mut preference = preference.unwrap();
        preference.file_path = path.to_path_buf();

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
        self.language = other.language.clone();
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_preference_store_default() {
        let preference_json = "preference.json";
        let data_dir = "data_dir";

        let preference_store = PreferenceStore::default_internal(preference_json, data_dir);

        assert_eq!(preference_store.theme, Theme::System);
        assert_eq!(preference_store.language, LanguageCode::JaJp);
        assert_eq!(preference_store.delete_on_import, false);
        assert_eq!(preference_store.use_unitypackage_selected_open, true);
        assert_eq!(preference_store.update_channel, UpdateChannel::Stable);
        assert_eq!(
            preference_store.file_path.to_string_lossy(),
            preference_json
        );
        assert_eq!(preference_store.data_dir_path.to_string_lossy(), data_dir);
    }

    #[test]
    fn test_load_preference_store() {
        let json_data = r#"
        {
            "version": 4,
            "data": {
                "dataDirPath": "C:\\fake-path\\KonoAsset",
                "theme": "dark",
                "language": "ja-JP",
                "deleteOnImport": true,
                "useUnitypackageSelectedOpen": true,
                "updateChannel": "Stable"
            }
        }
        "#;

        let path = "test/temp/preference-load.json";

        if std::fs::exists(path).unwrap() {
            std::fs::remove_file(path).unwrap();
        }

        std::fs::write(path, json_data).unwrap();

        let preference = PreferenceStore::load_internal(path).unwrap().unwrap();

        assert_eq!(
            preference.data_dir_path.to_string_lossy(),
            "C:\\fake-path\\KonoAsset"
        );
        assert_eq!(preference.theme, Theme::Dark);
        assert_eq!(preference.language, LanguageCode::JaJp);
        assert_eq!(preference.delete_on_import, true);
        assert_eq!(preference.use_unitypackage_selected_open, true);
        assert_eq!(preference.update_channel, UpdateChannel::Stable);
        assert_eq!(preference.file_path.to_string_lossy(), path);
    }

    #[test]
    fn test_save_preference_store() {
        let path = "test/temp/preference-save.json";

        if std::fs::exists(path).unwrap() {
            std::fs::remove_file(path).unwrap();
        }

        let preference = PreferenceStore {
            file_path: PathBuf::from(&path),

            data_dir_path: PathBuf::from("C:\\fake-path\\KonoAsset"),
            theme: Theme::Light,
            language: LanguageCode::EnUs,

            delete_on_import: false,
            use_unitypackage_selected_open: false,

            update_channel: UpdateChannel::PreRelease,
        };

        preference.save().unwrap();

        let file_content = std::fs::read_to_string(path).unwrap();

        let expected_content = r#"
        {
            "version": 4,
            "data": {
                "dataDirPath": "C:\\fake-path\\KonoAsset",
                "theme": "light",
                "language": "en-US",
                "deleteOnImport": false,
                "useUnitypackageSelectedOpen": false,
                "updateChannel": "PreRelease"
            }
        }
                "#
        .replace("\n", "")
        .replace(" ", "");

        assert_eq!(file_content.trim(), expected_content.trim());
    }
}
