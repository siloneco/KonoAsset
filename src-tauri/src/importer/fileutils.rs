use std::{error::Error, path::PathBuf};

use crate::{
    file::modify_guard::{self, DeletionGuard, FileTransferGuard},
    zip::extractor::extract_zip,
};

pub async fn execute_image_fixation(src: &PathBuf) -> Result<Option<PathBuf>, String> {
    if !src.exists() {
        return Err(format!("File not found: {}", src.display()));
    }

    let filename = src.file_name().unwrap().to_str().unwrap();
    if !filename.starts_with("temp_") {
        return Ok(None);
    }

    let new_filename = &filename[5..];
    let new_path = src.with_file_name(new_filename);

    let result = modify_guard::move_file_or_dir(src, &new_path, FileTransferGuard::new(None, None));

    if let Err(e) = result {
        return Err(e.to_string());
    }

    return Ok(Some(new_path));
}

pub fn import_asset(
    src_import_asset_path: &PathBuf,
    destination: &PathBuf,
    delete_source: bool,
) -> Result<(), Box<dyn Error>> {
    let mut new_destination = destination.clone();

    if src_import_asset_path.is_dir() {
        new_destination.push(src_import_asset_path.file_name().unwrap());

        std::fs::create_dir_all(&new_destination)?;

        modify_guard::copy_dir(
            src_import_asset_path,
            &new_destination,
            delete_source,
            FileTransferGuard::new(None, None),
        )?;
    } else {
        let extension = src_import_asset_path.extension().unwrap();
        if extension == "zip" {
            new_destination.push(src_import_asset_path.file_stem().unwrap());

            std::fs::create_dir_all(&new_destination)?;

            let result = extract_zip(src_import_asset_path, &new_destination);

            if let Err(e) = result {
                return Err(e.into());
            }

            if delete_source {
                modify_guard::delete_single_file(
                    src_import_asset_path,
                    DeletionGuard::new(src_import_asset_path.clone()),
                )?;
            }
        } else {
            new_destination.push(src_import_asset_path.file_name().unwrap());

            modify_guard::copy_file(
                src_import_asset_path,
                &new_destination,
                delete_source,
                FileTransferGuard::new(None, None),
            )?;
        }
    }

    Ok(())
}
