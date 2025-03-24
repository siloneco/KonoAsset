use serde::{Deserialize, Serialize};

use crate::language::structs::LanguageCode;

#[derive(Serialize, Debug, Clone, specta::Type)]
pub struct LocalizedChanges {
    pub version: String,
    pub features: Option<Vec<String>>,
    pub fixes: Option<Vec<String>>,
    pub others: Option<Vec<String>>,
}

impl LocalizedChanges {
    pub fn new(
        version: String,
        features: Option<Vec<String>>,
        fixes: Option<Vec<String>>,
        others: Option<Vec<String>>,
    ) -> Self {
        Self {
            version,
            features,
            fixes,
            others,
        }
    }
}

#[derive(Deserialize, Debug, Clone)]
pub struct ChangelogVersion {
    pub version: String,
    pub features: Option<Vec<ChangelogEntry>>,
    pub fixes: Option<Vec<ChangelogEntry>>,
    pub others: Option<Vec<ChangelogEntry>>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct ChangelogEntry {
    pub text: String,
    pub langs: Option<Vec<ChangelogTranslatedEntry>>,
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
