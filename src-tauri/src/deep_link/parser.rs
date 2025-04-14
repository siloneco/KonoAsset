use std::path::PathBuf;

use tauri::Url;

use super::definitions::{AddAssetDeepLink, DeepLinkAction};

pub fn parse(args: &Vec<String>) -> Vec<DeepLinkAction> {
    if args.len() < 2 {
        return vec![];
    }

    let mut deep_links = vec![];

    for i in 1..args.len() {
        let arg = &args[i];

        let result = Url::parse(&arg);
        if result.is_err() {
            continue;
        }

        let url = result.unwrap();
        let domain = url.domain();

        if domain.is_none() {
            continue;
        }
        let domain = domain.unwrap();

        match domain {
            "add-asset" | "addAsset" => {
                let deep_link_info = parse_as_add_asset(&url);

                if let Some(info) = deep_link_info {
                    deep_links.push(DeepLinkAction::AddAsset(info));
                }
            }
            _ => {
                log::warn!("Unknown domain: {}", domain);
            }
        }
    }

    deep_links
}

fn parse_as_add_asset(url: &Url) -> Option<AddAssetDeepLink> {
    let queries = url.query_pairs();

    let mut path = vec![];
    let mut booth_item_id = None;

    for (key, value) in queries {
        match key.to_ascii_lowercase().as_ref() {
            "path" | "dir" | "file" => {
                let value = PathBuf::from(value.as_ref());
                path.push(value);
            }
            "id" | "boothid" | "boothitemid" => {
                let id = value.parse::<u64>();

                if let Err(e) = id {
                    log::error!(
                        "Unable to parse {} into booth item id: {}",
                        value.as_ref(),
                        e
                    );
                    continue;
                }

                booth_item_id = Some(id.unwrap());
            }
            _ => {}
        }
    }

    if path.len() <= 0 {
        log::error!("Path is not specified in add-asset deep link");
        return None;
    }

    Some(AddAssetDeepLink::new(path, booth_item_id))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse() {
        let parsed = parse(&vec![
            "konoasset.exe".to_string(),
            "konoasset://add-asset?path=.%2Ftest1.txt&path=.%2Ftest2.txt&boothItemId=123"
                .to_string(),
        ]);

        assert_eq!(parsed.len(), 1);
        assert!(matches!(parsed[0], DeepLinkAction::AddAsset(_)));

        let DeepLinkAction::AddAsset(info) = &parsed[0];

        let expected_path = vec![PathBuf::from("./test1.txt"), PathBuf::from("./test2.txt")];
        assert_eq!(info.path, expected_path);
        assert_eq!(info.booth_item_id, Some(123));
    }
}
