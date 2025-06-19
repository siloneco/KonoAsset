use language::LanguageCode;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Debug, Clone, specta::Type)]
pub struct LocalizedChanges {
    pub version: String,
    pub pre_release: bool,
    pub features: Vec<String>,
    pub fixes: Vec<String>,
    pub others: Vec<String>,
}

impl LocalizedChanges {
    pub fn new(
        version: String,
        pre_release: bool,
        features: Vec<String>,
        fixes: Vec<String>,
        others: Vec<String>,
    ) -> Self {
        Self {
            version,
            pre_release,
            features,
            fixes,
            others,
        }
    }
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ChangelogVersion {
    pub version: String,
    #[serde(default)] // default = false
    pub pre_release: bool,

    #[serde(default)] // default = empty array
    pub features: Vec<ChangelogEntry>,
    #[serde(default)] // default = empty array
    pub fixes: Vec<ChangelogEntry>,
    #[serde(default)] // default = empty array
    pub others: Vec<ChangelogEntry>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct ChangelogEntry {
    pub text: String,

    #[serde(default)] // default = empty array
    pub langs: Vec<ChangelogTranslatedEntry>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct ChangelogTranslatedEntry {
    pub lang: ChangelogTranslatedEntryLang,
    pub text: String,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(untagged)]
pub enum ChangelogTranslatedEntryLang {
    Single(String),
    Multiple(Vec<String>),
}

impl ChangelogTranslatedEntryLang {
    pub fn is_language_supported(&self, language: &LanguageCode) -> bool {
        match self {
            Self::Single(lang) => lang == language.code(),
            Self::Multiple(langs) => langs.iter().any(|lang| lang == &language.code()),
        }
    }
}
