mod avatar_explorer;
mod definitions;
mod human_readable_zip_exporter;
mod konoasset_exporter;
mod util;

use std::{path::Path, sync::Arc};
use storage::asset_storage::AssetStorage;
use tauri::AppHandle;
use tokio::sync::Mutex;

pub async fn export_as_avatar_explorer_compatible_structure<P>(
    store_provider: Arc<Mutex<AssetStorage>>,
    path: P,
    app: &AppHandle,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    avatar_explorer::export_as_avatar_explorer_compatible_structure(store_provider, path, Some(app))
        .await
}

pub async fn export_as_human_readable_structured_zip<P>(
    store_provider: Arc<Mutex<AssetStorage>>,
    path: P,
    app: &AppHandle,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    human_readable_zip_exporter::export_as_human_readable_structured_zip(
        store_provider,
        path,
        Some(app),
    )
    .await
}

pub async fn export_as_konoasset_structured_zip<P>(
    store_provider: Arc<Mutex<AssetStorage>>,
    path: P,
    app: &AppHandle,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    konoasset_exporter::export_as_konoasset_structured_zip(store_provider, path, Some(app)).await
}
