use model::preference::LanguageCode;
use semver::Version;

use super::definitions::{ChangelogEntry, ChangelogVersion, LocalizedChanges};

pub async fn pick_changes_in_preferred_lang<S, T>(
    changelog: Vec<ChangelogVersion>,
    current_version: S,
    target_version: T,
    preferred_language: &LanguageCode,
    skip_pre_releases: bool,
) -> Result<Vec<LocalizedChanges>, String>
where
    S: AsRef<str>,
    T: AsRef<str>,
{
    let mut changes = Vec::new();

    let current_version = Version::parse(current_version.as_ref())
        .map_err(|e| format!("Failed to parse version: {}", e))?;
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

#[cfg(test)]
mod tests {
    use crate::parser::parse_changelog;

    use super::*;

    #[tokio::test]
    async fn test_pick_changes_in_preferred_lang() {
        let example = parse_changelog(include_str!("../test/example_changelog.json"))
            .await
            .unwrap();

        let result =
            pick_changes_in_preferred_lang(example, "1.5.0", "2.0.0", &LanguageCode::JaJp, false)
                .await
                .unwrap();

        assert_eq!(result.len(), 1);
        assert_eq!(result[0].version, "2.0.0");
        assert_eq!(result[0].pre_release, false);
        assert_eq!(result[0].features.len(), 1);
        assert_eq!(result[0].fixes.len(), 1);
        assert_eq!(result[0].others.len(), 1);
        assert_eq!(result[0].features[0], "v2.0.0 新機能 1");
        assert_eq!(result[0].fixes[0], "v2.0.0 修正 1");
        assert_eq!(result[0].others[0], "v2.0.0 他の変更 1");
    }
}
