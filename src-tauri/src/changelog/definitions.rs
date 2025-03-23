use serde::{Deserialize, Serialize};

#[derive(Serialize, Debug, Clone, specta::Type)]
pub struct LocalizedChanges {
    pub target_version: String,
    pub features: Option<Vec<String>>,
    pub fixes: Option<Vec<String>>,
    pub others: Option<Vec<String>>,
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
pub enum ChangelogTranslatedEntryLang {
    Single(String),
    Multiple(Vec<String>),
}
