use std::{fs::File, path::Path};

use super::structs::{CustomLocalizationData, LanguageCode, LocalizationData};

pub fn load_from_file<P>(path: P) -> Result<LocalizationData, String>
where
    P: AsRef<Path>,
{
    let file = File::open(path.as_ref())
        .map_err(|e| format!("Failed to open file at {}: {}", path.as_ref().display(), e))?;

    let data: CustomLocalizationData = serde_json::from_reader(file).map_err(|e| {
        format!(
            "Failed to parse JSON from file at {}: {}",
            path.as_ref().display(),
            e
        )
    })?;

    return Ok(data.into());
}

pub fn load_from_language_code(language: LanguageCode) -> Result<LocalizationData, String> {
    let str_data = language.json_str();
    let data: LocalizationData = serde_json::from_str(str_data)
        .map_err(|e| format!("Failed to parse JSON from string: {}", e))?;

    Ok(data)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_load_language_files() {
        let ja_jp = load_from_language_code(LanguageCode::JaJp).unwrap();
        assert_eq!(ja_jp.language, LanguageCode::JaJp);

        let en_us = load_from_language_code(LanguageCode::EnUs).unwrap();
        assert_eq!(en_us.language, LanguageCode::EnUs);

        let en_gb = load_from_language_code(LanguageCode::EnGb).unwrap();
        assert_eq!(en_gb.language, LanguageCode::EnGb);
    }
}
