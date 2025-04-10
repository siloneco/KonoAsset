mod directory;
mod zip;

use crate::data_store::provider::StoreProvider;
use std::path::Path;
use tauri::AppHandle;

pub async fn import_data_store_from_directory<P>(
    data_store_provider: &mut StoreProvider,
    path: P,
    app_handle: AppHandle,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    directory::import_data_store_from_directory(data_store_provider, path, Some(app_handle)).await
}

pub async fn import_data_store_from_zip<P>(
    data_store_provider: &mut StoreProvider,
    path: P,
    app_handle: AppHandle,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    zip::import_data_store_from_zip(data_store_provider, path, Some(app_handle)).await
}
