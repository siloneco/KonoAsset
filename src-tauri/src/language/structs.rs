use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_with::serde_as;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, specta::Type)]
#[serde(rename_all = "camelCase")]
pub enum LanguageCode {
    JaJp,
    EnUs,
}

impl LanguageCode {
    pub fn json_str(&self) -> &str {
        match self {
            LanguageCode::JaJp => include_str!("../../../locales/ja-JP.json"),
            LanguageCode::EnUs => include_str!("../../../locales/en-US.json"),
        }
    }
}

#[serde_as]
#[derive(Debug, Serialize, Deserialize, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct LocalizationData {
    pub language: LanguageCode,

    // #[serde_as(as = "HashMap<String, _>")]
    pub data: HashMap<String, String>,
}
