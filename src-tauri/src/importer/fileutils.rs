use std::{
    error::Error,
    ffi::OsStr,
    path::{Path, PathBuf},
};

use crate::{
    file::{
        cleanup::DeleteOnDrop,
        modify_guard::{self, FileTransferGuard},
    },
    zip::extractor::extract_zip,
};

pub async fn execute_image_fixation(src: &PathBuf) -> Result<Option<String>, String> {
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
        modify_guard::copy_file(src, &new_path, false, FileTransferGuard::new(None, None)).await;

    if let Err(e) = result {
        return Err(e.to_string());
    }

    return Ok(Some(new_filename.to_string()));
}

pub async fn import_asset<P>(
    src: P,
    dest: P,
    cleanup_on_fail: bool,
    progress_callback: impl Fn(f32, String),
) -> Result<(), Box<dyn Error>>
where
    P: AsRef<Path>,
{
    let src = src.as_ref();
    let dest = dest.as_ref();

    if src.is_dir() {
        let file_name = src.file_name().unwrap_or(OsStr::new("imported"));

        let destination = dest.join(file_name);

        let delete_on_drop = if cleanup_on_fail {
            Some(DeleteOnDrop::new(destination.clone()))
        } else {
            None
        };

        tokio::fs::create_dir_all(&destination).await?;
        modify_guard::copy_dir(
            &src.to_path_buf(),
            &destination,
            false,
            FileTransferGuard::new(None, None),
            progress_callback,
        )
        .await?;

        if let Some(mut delete_on_drop) = delete_on_drop {
            delete_on_drop.mark_as_completed();
        }
    } else {
        let extension = src.extension();

        if extension == Some(OsStr::new("zip")) {
            let file_stem = src.file_stem().unwrap_or(OsStr::new("imported"));

            let destination = dest.join(file_stem);

            let delete_on_drop = if cleanup_on_fail {
                Some(DeleteOnDrop::new(destination.clone()))
            } else {
                None
            };

            tokio::fs::create_dir_all(&destination).await?;
            extract_zip(&src.to_path_buf(), &destination, progress_callback).await?;

            if let Some(mut delete_on_drop) = delete_on_drop {
                delete_on_drop.mark_as_completed();
            }
        } else {
            let file_name = src.file_name().unwrap_or(OsStr::new("imported"));

            let destination = dest.join(file_name);

            let delete_on_drop = if cleanup_on_fail {
                Some(DeleteOnDrop::new(destination.clone()))
            } else {
                None
            };

            modify_guard::copy_file(
                &src.to_path_buf(),
                &destination,
                false,
                FileTransferGuard::new(None, None),
            )
            .await?;

            if let Some(mut delete_on_drop) = delete_on_drop {
                delete_on_drop.mark_as_completed();
            }
        }
    }

    Ok(())
}
