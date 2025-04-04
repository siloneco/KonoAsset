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

pub async fn execute_image_fixation<P>(src: P) -> Result<Option<String>, String>
where
    P: AsRef<Path>,
{
    let src = src.as_ref();

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

    let result = modify_guard::copy_file(src, &new_path, false, FileTransferGuard::none()).await;

    if let Err(e) = result {
        return Err(e.to_string());
    }

    return Ok(Some(new_filename.to_string()));
}

pub async fn import_asset<P, Q>(
    src: P,
    dest: Q,
    cleanup_on_fail: bool,
    progress_callback: impl Fn(f32, String),
) -> Result<(), Box<dyn Error>>
where
    P: AsRef<Path>,
    Q: AsRef<Path>,
{
    let src = src.as_ref();
    let dest = dest.as_ref();

    if src.is_dir() {
        let file_name = src
            .file_name()
            .unwrap_or(OsStr::new("imported"))
            .to_str()
            .unwrap_or("imported");
        let destination = select_destination_path(dest, file_name);

        let delete_on_drop = if cleanup_on_fail {
            Some(DeleteOnDrop::new(destination.clone()))
        } else {
            None
        };

        tokio::fs::create_dir_all(&destination).await?;

        // Convert to PathBuf to avoid lifetime issues
        let src = src.to_path_buf();

        modify_guard::copy_dir(
            src,
            destination,
            false,
            FileTransferGuard::none(),
            progress_callback,
        )
        .await?;

        if let Some(mut delete_on_drop) = delete_on_drop {
            delete_on_drop.mark_as_completed();
        }
    } else {
        let extension = src.extension();

        if extension == Some(OsStr::new("zip")) {
            let file_stem = src
                .file_stem()
                .unwrap_or(OsStr::new("imported"))
                .to_str()
                .unwrap_or("imported");
            let destination = select_destination_path(dest, file_stem);

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
            let file_name = src
                .file_name()
                .unwrap_or(OsStr::new("imported"))
                .to_str()
                .unwrap_or("imported");
            let destination = select_destination_path(dest, file_name);

            let delete_on_drop = if cleanup_on_fail {
                Some(DeleteOnDrop::new(destination.clone()))
            } else {
                None
            };

            modify_guard::copy_file(
                &src.to_path_buf(),
                &destination,
                false,
                FileTransferGuard::none(),
            )
            .await?;

            if let Some(mut delete_on_drop) = delete_on_drop {
                delete_on_drop.mark_as_completed();
            }
        }
    }

    Ok(())
}

fn select_destination_path<P, S>(base: P, prefer_filename: S) -> PathBuf
where
    P: AsRef<Path>,
    S: AsRef<str>,
{
    let base = base.as_ref();
    let prefer_filename = prefer_filename.as_ref();

    let mut preferred_path = base.join(prefer_filename);

    if !preferred_path.exists() {
        return preferred_path;
    }

    let file_stem = preferred_path
        .file_stem()
        .unwrap_or(OsStr::new("imported"))
        .to_string_lossy()
        .to_string();
    let file_extension = preferred_path
        .extension()
        .unwrap_or(OsStr::new(""))
        .to_string_lossy()
        .to_string();

    let mut i = 1;
    while preferred_path.exists() {
        let new_file_stem = format!("{} ({})", file_stem, i);
        preferred_path = base.join(format!("{}.{}", new_file_stem, file_extension));
        i += 1;
    }

    preferred_path
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_image_fixation() {
        let dir = "test/temp/image_fixation";
        let filename = "temp_image.png";

        let file_path = PathBuf::from(dir).join(filename);

        if std::fs::exists(dir).unwrap() {
            std::fs::remove_dir_all(dir).unwrap();
        }

        std::fs::create_dir_all(dir).unwrap();
        std::fs::write(&file_path, "dummy").unwrap();

        let result = execute_image_fixation(&file_path).await.unwrap().unwrap();

        assert_eq!(result, "image.png");
        assert!(file_path.exists());
        assert!(file_path.with_file_name(&result).exists());
    }

    #[tokio::test]
    async fn test_skip_image_fixation() {
        let dir = "test/temp/skip_image_fixation";
        let filename = "image.png";

        let file_path = PathBuf::from(dir).join(filename);

        if std::fs::exists(dir).unwrap() {
            std::fs::remove_dir_all(dir).unwrap();
        }

        std::fs::create_dir_all(dir).unwrap();
        std::fs::write(&file_path, "dummy").unwrap();

        let result = execute_image_fixation(&file_path).await.unwrap();

        assert!(result.is_none());
        assert!(file_path.exists());
    }

    #[test]
    fn test_select_destination_path() {
        let base = PathBuf::from("test/temp/select_destination_path");

        if std::fs::exists(&base).unwrap() {
            std::fs::remove_dir_all(&base).unwrap();
        }

        std::fs::create_dir_all(&base).unwrap();

        let result = select_destination_path(&base, "image.png");
        assert_eq!(result.file_name().unwrap(), OsStr::new("image.png"));

        std::fs::write(&result, "dummy").unwrap();

        let result = select_destination_path(&base, "image.png");
        assert_eq!(result.file_name().unwrap(), OsStr::new("image (1).png"));

        std::fs::write(&result, "dummy").unwrap();

        let result = select_destination_path(&base, "image.png");
        assert_eq!(result.file_name().unwrap(), OsStr::new("image (2).png"));
    }

    #[tokio::test]
    async fn test_import_assets() {
        let base = PathBuf::from("test/temp/import_asset");

        if std::fs::exists(&base).unwrap() {
            std::fs::remove_dir_all(&base).unwrap();
        }

        let dir_src = base.join("src/dir");
        let zip_src = base.join("src/zip-file.zip");
        let normal_file_src = base.join("src/normal-file.txt");

        let dest = base.join("dest");

        std::fs::create_dir_all(&dir_src).unwrap();
        std::fs::create_dir_all(&dest).unwrap();

        std::fs::write(dir_src.join("dummy.txt"), b"dummy").unwrap();
        std::fs::copy("test/zip/normal.zip", &zip_src).unwrap();
        std::fs::write(&normal_file_src, b"dummy").unwrap();

        import_asset(&dir_src, &dest, true, |_, _| {})
            .await
            .unwrap();
        import_asset(&zip_src, &dest, true, |_, _| {})
            .await
            .unwrap();
        import_asset(&normal_file_src, &dest, true, |_, _| {})
            .await
            .unwrap();

        let dir_dummy_txt = dest.join("dir/dummy.txt");
        let extracted_zip_dir = dest.join("zip-file");
        let normal_file_txt = dest.join("normal-file.txt");

        assert!(dir_dummy_txt.exists());
        assert_eq!(std::fs::read_to_string(&dir_dummy_txt).unwrap(), "dummy");
        assert!(extracted_zip_dir.exists());
        assert!(normal_file_txt.exists());
        assert_eq!(std::fs::read_to_string(&normal_file_txt).unwrap(), "dummy");
    }
}
