use std::path::PathBuf;

use serde::Serialize;

pub struct StartupDeepLinkStore {
    deep_links: Option<Vec<DeepLinkAction>>,
}

impl StartupDeepLinkStore {
    pub fn new(deep_links: Vec<DeepLinkAction>) -> Self {
        if deep_links.is_empty() {
            return Self { deep_links: None };
        }

        Self {
            deep_links: Some(deep_links),
        }
    }

    pub fn get(&mut self) -> Option<Vec<DeepLinkAction>> {
        self.deep_links.take()
    }
}

pub enum DeepLinkAction {
    AddAsset(AddAssetDeepLink),
}

#[derive(Serialize, Debug, Clone, specta::Type, tauri_specta::Event)]
#[serde(rename_all = "camelCase")]
pub struct AddAssetDeepLink {
    pub path: PathBuf,
    pub booth_item_id: Option<u64>,
}

impl AddAssetDeepLink {
    pub fn new(path: PathBuf, booth_item_id: Option<u64>) -> Self {
        Self {
            path,
            booth_item_id,
        }
    }
}
