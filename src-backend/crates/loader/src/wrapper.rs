use std::path::Path;

use model::preference::PreferenceStore;

use crate::VersionedPreferences;

pub fn load_preference_store<P, Q>(
    preference_path: P,
    document_dir: Q,
) -> Result<PreferenceStore, std::io::Error>
where
    P: AsRef<Path>,
    Q: AsRef<Path>,
{
    let path = preference_path.as_ref();

    if !path.exists() {
        return Ok(PreferenceStore::default(preference_path, document_dir));
    }

    log::info!("{}", path.display());

    let reader = std::fs::File::open(&path)?;
    let preference: Result<PreferenceStore, _> =
        serde_json::from_reader::<_, VersionedPreferences>(reader)?.try_into();

    if let Err(e) = preference {
        log::error!("Failed to load preference: {}", e);
        return Ok(PreferenceStore::default(preference_path, document_dir));
    }

    let mut preference = preference.unwrap();
    preference.file_path = path.to_path_buf();

    Ok(preference)
}

pub fn save_preference_store(preference: &PreferenceStore) -> Result<(), std::io::Error> {
    let path = &preference.file_path;

    let writer = std::fs::File::create(path)?;

    let versioned = VersionedPreferences::try_from(preference.clone());

    if let Err(e) = versioned {
        log::error!("Failed to save preference: {}", e);
        return Ok(());
    }

    serde_json::to_writer(writer, &versioned.unwrap())?;

    Ok(())
}
