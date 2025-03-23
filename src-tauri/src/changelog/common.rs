use super::definitions::{ChangelogVersion, LocalizedChanges};

const URL: &str = "https://releases.konoasset.dev/manifests/changelog.json";

pub async fn fetch_changelogs() -> Result<Vec<ChangelogVersion>, String> {
    unimplemented!()
}

pub async fn extract_changes<T, P>(
    changelog: Vec<ChangelogVersion>,
    target_version: T,
    preferred_language: P,
) -> Result<LocalizedChanges, String>
where
    T: AsRef<str>,
    P: AsRef<str>,
{
    unimplemented!()
}
