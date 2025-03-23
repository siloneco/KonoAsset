use std::sync::Arc;

use tauri::State;
use tokio::sync::Mutex;

use crate::{changelog::LocalizedChanges, updater::update_handler::UpdateHandler};

#[tauri::command]
#[specta::specta]
pub async fn get_changelog(
    update_handler: State<'_, Arc<Mutex<UpdateHandler>>>,
) -> Result<Vec<LocalizedChanges>, String> {
    unimplemented!()
}
