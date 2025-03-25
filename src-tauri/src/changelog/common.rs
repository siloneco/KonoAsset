use std::time::Duration;

use semver::Version;

use crate::language::structs::LanguageCode;

use super::definitions::{ChangelogEntry, ChangelogVersion, LocalizedChanges};

const URL: &str = "https://releases.konoasset.dev/manifests/changelog.json";
const VERSION: &str = env!("CARGO_PKG_VERSION");

pub async fn fetch_and_parse_changelog() -> Result<Vec<ChangelogVersion>, String> {
    let changelog_body = fetch_changelogs().await?;
    let changelog = parse_changelog(changelog_body).await?;

    Ok(changelog)
}

async fn fetch_changelogs() -> Result<String, String> {
    let client = get_reqwest_client()?;

    let response = client
        .get(URL)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch changelogs: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Failed to fetch changelogs: {}", response.status()));
    }

    response
        .text()
        .await
        .map_err(|e| format!("Failed to fetch changelogs: {}", e))
}

async fn parse_changelog<S>(text: S) -> Result<Vec<ChangelogVersion>, String>
where
    S: AsRef<str>,
{
    let changelog = serde_json::from_str(text.as_ref())
        .map_err(|e| format!("Failed to parse changelog: {}", e))?;

    Ok(changelog)
}

pub async fn pick_changes_in_preferred_lang<S>(
    changelog: Vec<ChangelogVersion>,
    target_version: S,
    preferred_language: &LanguageCode,
    skip_pre_releases: bool,
) -> Result<Vec<LocalizedChanges>, String>
where
    S: AsRef<str>,
{
    let mut changes = Vec::new();

    let current_version =
        Version::parse(VERSION).map_err(|e| format!("Failed to parse version: {}", e))?;
    let target_version = Version::parse(target_version.as_ref())
        .map_err(|e| format!("Failed to parse target version: {}", e))?;

    for item in changelog.iter().rev() {
        let cursor_version = match Version::parse(&item.version) {
            Ok(v) => v,
            Err(e) => {
                log::error!("Failed to parse version: {}", e);
                continue;
            }
        };

        // changelog.json では新しいバージョンが前、古いバージョンが後ろにある
        // changelog.iter().rev() で逆順にしているため、バージョンが古い順に処理される
        // そのため、バージョンが現在のバージョンよりも古い場合は continue、新しい場合は break する
        if cursor_version <= current_version {
            continue;
        }
        if target_version < cursor_version {
            break;
        }

        let pre_release = item.pre_release;

        if skip_pre_releases && pre_release {
            continue;
        }

        let features = localize_entries(&item.features, &preferred_language);
        let fixes = localize_entries(&item.fixes, &preferred_language);
        let others = localize_entries(&item.others, &preferred_language);

        changes.push(LocalizedChanges::new(
            item.version.clone(),
            pre_release,
            features,
            fixes,
            others,
        ));
    }

    changes.reverse();

    Ok(changes)
}

fn localize_entries(entries: &[ChangelogEntry], preferred_language: &LanguageCode) -> Vec<String> {
    entries
        .iter()
        .map(|entry| {
            let localized = entry
                .langs
                .iter()
                .find(|lang| lang.lang.is_language_supported(&preferred_language))
                .map(|lang| lang.text.clone());

            localized.unwrap_or_else(|| entry.text.clone())
        })
        .collect()
}

fn get_reqwest_client() -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .user_agent(format!("KonoAsset/{}", VERSION))
        .timeout(Duration::from_secs(5))
        .build()
        .map_err(|e| format!("Failed to create reqwest client: {}", e))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_parse_changelog() {
        let text_changelog = include_str!("../../../changelog.json");
        parse_changelog(text_changelog).await.unwrap();
    }
}
