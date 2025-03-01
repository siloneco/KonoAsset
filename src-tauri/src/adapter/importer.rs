use std::path::Path;

// use async_zip::base::read::seek::ZipFileReader;
// use tokio::{fs::File, io::BufReader};
// use tokio_util::compat::Compat;

use tauri::AppHandle;
use tauri_specta::Event;

use crate::{
    data_store::provider::StoreProvider,
    definitions::entities::ProgressEvent,
    file::modify_guard::{self, FileTransferGuard},
};

pub async fn import_data_store<P>(
    data_store_provider: &mut StoreProvider,
    path: P,
    app_handle: &AppHandle,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    let path = path.as_ref();

    let mut external_data_store_provider = if path.is_dir() {
        read_dir_as_data_store_provider(path).await?
    } else {
        return Err(format!(
            "Invalid path. Expected a directory: {}",
            path.display()
        ));
    };

    data_store_provider
        .merge_from(&mut external_data_store_provider)
        .await?;

    let data_dir = data_store_provider.data_dir().join("data");
    let external_data_dir = path.join("data");

    modify_guard::copy_dir(
        external_data_dir,
        data_dir,
        false,
        FileTransferGuard::none(),
        |progress, filename| {
            let percentage = progress * 90f32;

            if let Err(e) = ProgressEvent::new(percentage, filename).emit(app_handle) {
                log::error!("Failed to emit progress event: {:?}", e);
            }
        },
    )
    .await
    .map_err(|e| format!("Failed to merge data directory: {}", e))?;

    let images_dir = data_store_provider.data_dir().join("images");
    let external_images_dir = path.join("images");

    modify_guard::copy_dir(
        external_images_dir,
        images_dir,
        false,
        FileTransferGuard::none(),
        |progress, filename| {
            let percentage = 90f32 + progress * 10f32;

            if let Err(e) = ProgressEvent::new(percentage, filename).emit(app_handle) {
                log::error!("Failed to emit progress event: {:?}", e);
            }
        },
    )
    .await
    .map_err(|e| format!("Failed to merge images directory: {}", e))?;

    Ok(())
}

// pub async fn read_zip_as_data_store_provider(
//     zip: ZipFileReader<Compat<BufReader<File>>>,
// ) -> Result<StoreProvider, Box<dyn Error>> {

// }

pub async fn read_dir_as_data_store_provider<P>(path: P) -> Result<StoreProvider, String>
where
    P: AsRef<Path>,
{
    let path = path.as_ref();

    if !path.is_dir() {
        return Err(format!(
            "Invalid path. Expected a directory: {}",
            path.display()
        ));
    }

    let mut provider = StoreProvider::create(&path.to_path_buf()).unwrap();
    provider.load_all_assets_from_files().await?;

    Ok(provider)
}
