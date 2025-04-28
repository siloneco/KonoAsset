use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, specta::Type)]
#[serde(rename_all = "camelCase")]
pub enum LanguageCode {
    #[serde(rename = "ja-JP", alias = "jaJp")] // alias is for legacy support
    JaJp,
    #[serde(rename = "en-US", alias = "enUs")] // alias is for legacy support
    EnUs,
    #[serde(rename = "en-GB", alias = "enGb")] // alias is for legacy support
    EnGb,
    #[serde(rename = "user-provided")]
    UserProvided(String),
}

impl LanguageCode {
    pub fn code(&self) -> &str {
        match self {
            LanguageCode::JaJp => "ja-JP",
            LanguageCode::EnUs => "en-US",
            LanguageCode::EnGb => "en-GB",
            LanguageCode::UserProvided(code) => code,
        }
    }

    pub fn booth_lang_code(&self) -> &str {
        match self {
            LanguageCode::JaJp => "ja",
            LanguageCode::EnUs | LanguageCode::EnGb => "en",
            LanguageCode::UserProvided(_) => "en",
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct LocalizationData {
    pub language: LanguageCode,
    pub data: HashMap<String, String>,
}

impl Default for LocalizationData {
    fn default() -> Self {
        Self {
            language: LanguageCode::EnUs,
            data: HashMap::new(),
        }
    }
}

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CustomLocalizationData {
    pub language: String,
    pub data: HashMap<String, String>,
}

impl Into<LocalizationData> for CustomLocalizationData {
    fn into(self) -> LocalizationData {
        LocalizationData {
            language: LanguageCode::UserProvided(self.language.clone()),
            data: self.data,
        }
    }
}

#[derive(Debug, Serialize, Clone, specta::Type)]
pub struct CustomLanguageFileLoadResult {
    pub data: LocalizationData,
    pub missing_keys: Vec<String>,
    pub additional_keys: Vec<String>,
}

impl CustomLanguageFileLoadResult {
    pub fn new(
        data: LocalizationData,
        missing_keys: Vec<String>,
        additional_keys: Vec<String>,
    ) -> Self {
        Self {
            data,
            missing_keys,
            additional_keys,
        }
    }
}
