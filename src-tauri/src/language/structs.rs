use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_with::serde_as;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, specta::Type)]
#[serde(rename_all = "camelCase")]
pub enum LanguageCode {
    #[serde(rename = "ja-JP", alias = "jaJp")] // alias is for legacy support
    JaJp,
    #[serde(rename = "en-US", alias = "enUs")] // alias is for legacy support
    EnUs,
    #[serde(rename = "en-GB", alias = "enGb")] // alias is for legacy support
    EnGb,
}

impl LanguageCode {
    pub fn json_str(&self) -> &str {
        match self {
            LanguageCode::JaJp => include_str!("../../../locales/ja-JP.json"),
            LanguageCode::EnUs => include_str!("../../../locales/en-US.json"),
            LanguageCode::EnGb => include_str!("../../../locales/en-GB.json"),
        }
    }

    pub fn code(&self) -> &str {
        match self {
            LanguageCode::JaJp => "ja-JP",
            LanguageCode::EnUs => "en-US",
            LanguageCode::EnGb => "en-GB",
        }
    }
}

#[serde_as]
#[derive(Debug, Serialize, Deserialize, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct LocalizationData {
    pub language: LanguageCode,
    pub data: HashMap<String, String>,
}
