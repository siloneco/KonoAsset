use std::{error::Error, ffi::OsStr, path::PathBuf};

use crate::{
    file::modify_guard::{self, DeletionGuard, FileTransferGuard},
    zip::extractor::extract_zip,
};

pub async fn execute_image_fixation(src: &PathBuf) -> Result<Option<PathBuf>, String> {
    if !src.exists() {
        return Err(format!("File not found: {}", src.display()));
    }

    let file_name = src.file_name();

    if file_name.is_none() {
        return Err(format!(
            "Failed to get filename from path: {}",
            src.display()
        ));
    }
    let file_name = file_name.unwrap();

    let file_name = file_name.to_str();

    if file_name.is_none() {
        return Err(format!(
            "Failed to convert filename to string: {}",
            src.display()
        ));
    }
    let file_name = file_name.unwrap();

    if !file_name.starts_with("temp_") {
        return Ok(None);
    }

    let new_filename = &file_name[5..];
    let new_path = src.with_file_name(new_filename);

    let result =
        modify_guard::move_file_or_dir(src, &new_path, FileTransferGuard::new(None, None)).await;

    if let Err(e) = result {
        return Err(e.to_string());
    }

    return Ok(Some(new_path));
}

pub async fn import_asset(
    src_import_asset_path: &PathBuf,
    destination: &PathBuf,
    delete_source: bool,
    progress_callback: impl Fn(f32, String),
) -> Result<(), Box<dyn Error>> {
    let mut new_destination = destination.clone();

    if src_import_asset_path.is_dir() {
        let file_name = src_import_asset_path
            .file_name()
            .unwrap_or(OsStr::new("imported"));

        new_destination.push(file_name);
        std::fs::create_dir_all(&new_destination)?;

        modify_guard::copy_dir(
            src_import_asset_path,
            &new_destination,
            delete_source,
            FileTransferGuard::new(None, None),
            progress_callback,
        )
        .await?;
    } else {
        let extension = src_import_asset_path.extension();

        if extension == Some(OsStr::new("zip")) {
            let file_stem = src_import_asset_path
                .file_stem()
                .unwrap_or(OsStr::new("imported"));

            new_destination.push(file_stem);
            std::fs::create_dir_all(&new_destination)?;

            let result =
                extract_zip(src_import_asset_path, &new_destination, progress_callback).await;

            if let Err(e) = result {
                return Err(e.into());
            }

            if delete_source {
                modify_guard::delete_single_file(
                    src_import_asset_path,
                    DeletionGuard::new(src_import_asset_path.clone()),
                )
                .await?;
            }
        } else {
            let file_name = src_import_asset_path
                .file_name()
                .unwrap_or(OsStr::new("imported"));

            new_destination.push(file_name);

            modify_guard::copy_file(
                src_import_asset_path,
                &new_destination,
                delete_source,
                FileTransferGuard::new(None, None),
            )
            .await?;

            progress_callback(1f32, "".to_string());
        }
    }

    Ok(())
}
