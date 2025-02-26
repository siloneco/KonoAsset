use std::{fs::File, path::Path};

use super::structs::{LanguageCode, LocalizationData};

pub fn load_from_file<P>(path: P) -> Result<LocalizationData, String>
where
    P: AsRef<Path>,
{
    let file = File::open(path.as_ref())
        .map_err(|e| format!("Failed to open file at {}: {}", path.as_ref().display(), e))?;

    let data: LocalizationData = serde_json::from_reader(file).map_err(|e| {
        format!(
            "Failed to parse JSON from file at {}: {}",
            path.as_ref().display(),
            e
        )
    })?;

    return Ok(data);
}

pub fn load_from_language_code(language: LanguageCode) -> Result<LocalizationData, String> {
    let str_data = language.json_str();
    let data: LocalizationData = serde_json::from_str(str_data)
        .map_err(|e| format!("Failed to parse JSON from string: {}", e))?;

    Ok(data)
}
