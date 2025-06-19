use tauri::AppHandle;
use tauri_specta::Event;

use super::definitions::DeepLinkAction;

pub fn execute_deep_links(app: &AppHandle, deep_links: &Vec<DeepLinkAction>) {
    for deep_link in deep_links {
        match deep_link {
            DeepLinkAction::AddAsset(info) => {
                if let Err(e) = info.emit(app) {
                    log::error!("Failed to emit add asset event: {}", e);
                }
            }
        }
    }
}
