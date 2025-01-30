use std::{path::PathBuf, sync::Arc};

use tokio::sync::Mutex;

pub struct DeletionGuard {
    must_be_parent: PathBuf,
}

impl DeletionGuard {
    pub fn new(must_be_parent: PathBuf) -> Self {
        Self { must_be_parent }
    }

    fn assert(&self, path: &PathBuf) -> Result<(), tokio::io::Error> {
        let parent_absolute = std::path::absolute(&self.must_be_parent).map_err(|e| {
            tokio::io::Error::new(
                tokio::io::ErrorKind::InvalidInput,
                format!("Failed to convert parent path to absolute path: {:?}", e),
            )
        })?;

        let path_absolute = std::path::absolute(path).map_err(|e| {
            tokio::io::Error::new(
                tokio::io::ErrorKind::InvalidInput,
                format!("Failed to convert path to absolute path: {:?}", e),
            )
        })?;

        if !path_absolute.starts_with(&parent_absolute) {
            return Err(tokio::io::Error::new(
                tokio::io::ErrorKind::InvalidInput,
                format!(
                    "Path {} is not a child of {}",
                    path_absolute.display(),
                    parent_absolute.display()
                ),
            ));
        }

        Ok(())
    }
}

pub async fn delete_single_file(
    path: &PathBuf,
    guard: DeletionGuard,
) -> Result<(), tokio::io::Error> {
    guard.assert(path)?;
    tokio::fs::remove_file(path).await
}

pub async fn delete_recursive(
    path: &PathBuf,
    guard: DeletionGuard,
) -> Result<(), tokio::io::Error> {
    guard.assert(path)?;

    let canonicalized = path.canonicalize()?;

    if canonicalized.is_dir() {
        tokio::fs::remove_dir_all(path).await
    } else {
        tokio::fs::remove_file(path).await
    }
}

pub struct FileTransferGuard {
    src_must_be_parent: Option<PathBuf>,
    dest_must_be_parent: Option<PathBuf>,
}

impl FileTransferGuard {
    pub fn new(src_must_be_parent: Option<PathBuf>, dest_must_be_parent: Option<PathBuf>) -> Self {
        Self {
            src_must_be_parent,
            dest_must_be_parent,
        }
    }

    fn assert(&self, src: &PathBuf, dest: &PathBuf) -> Result<(), tokio::io::Error> {
        if let Some(src_must_be_parent) = &self.src_must_be_parent {
            let src_must_be_parent_absolute =
                std::path::absolute(src_must_be_parent).map_err(|e| {
                    tokio::io::Error::new(
                        tokio::io::ErrorKind::InvalidInput,
                        format!(
                            "Failed to convert source parent path to absolute path: {:?}",
                            e
                        ),
                    )
                })?;

            let src_absolute = std::path::absolute(src).map_err(|e| {
                tokio::io::Error::new(
                    tokio::io::ErrorKind::InvalidInput,
                    format!("Failed to convert source path to absolute path: {:?}", e),
                )
            })?;

            if !src_absolute.starts_with(&src_must_be_parent_absolute) {
                return Err(tokio::io::Error::new(
                    tokio::io::ErrorKind::InvalidInput,
                    format!(
                        "Source path {:?} is not a child of {:?}",
                        src_absolute, src_must_be_parent_absolute
                    ),
                ));
            }
        }

        if let Some(dest_must_be_parent) = &self.dest_must_be_parent {
            let dest_must_be_parent_absolute =
                std::path::absolute(dest_must_be_parent).map_err(|e| {
                    tokio::io::Error::new(
                        tokio::io::ErrorKind::InvalidInput,
                        format!(
                            "Failed to convert destination parent path to absolute path: {:?}",
                            e
                        ),
                    )
                })?;

            let dest_absolute = std::path::absolute(dest).map_err(|e| {
                tokio::io::Error::new(
                    tokio::io::ErrorKind::InvalidInput,
                    format!(
                        "Failed to convert destination path to absolute path: {:?}",
                        e
                    ),
                )
            })?;

            if !dest_absolute.starts_with(&dest_must_be_parent_absolute) {
                return Err(tokio::io::Error::new(
                    tokio::io::ErrorKind::InvalidInput,
                    format!(
                        "Destination path {} is not a child of {}",
                        dest_absolute.display(),
                        dest_must_be_parent_absolute.display()
                    ),
                ));
            }
        }

        Ok(())
    }
}

pub async fn move_file_or_dir(
    src: &PathBuf,
    dest: &PathBuf,
    guard: FileTransferGuard,
) -> Result<(), tokio::io::Error> {
    guard.assert(src, dest)?;
    tokio::fs::rename(src, dest).await
}

pub async fn copy_file(
    src: &PathBuf,
    dest: &PathBuf,
    delete_source: bool,
    guard: FileTransferGuard,
) -> Result<(), tokio::io::Error> {
    if !src.is_file() {
        return Err(tokio::io::Error::new(
            tokio::io::ErrorKind::InvalidInput,
            "Source path must be a file",
        ));
    }

    guard.assert(src, dest)?;
    tokio::fs::copy(src, dest).await?;

    if delete_source {
        let guard = DeletionGuard::new(src.clone());
        delete_single_file(src, guard).await?;
    }

    Ok(())
}

pub async fn copy_dir(
    src: &PathBuf,
    dest: &PathBuf,
    delete_source: bool,
    guard: FileTransferGuard,
    progress_callback: impl Fn(f32, String),
) -> Result<(), tokio::io::Error> {
    if !src.is_dir() {
        return Err(tokio::io::Error::new(
            tokio::io::ErrorKind::InvalidInput,
            "Source path must be a directory",
        ));
    }

    if !dest.exists() {
        if let Err(e) = tokio::fs::create_dir_all(&dest).await {
            return Err(tokio::io::Error::new(
                tokio::io::ErrorKind::InvalidInput,
                format!("Failed to create destination directory: {:?}", e),
            ));
        }
    }

    guard.assert(src, dest)?;

    let amount_of_entries = count_entries(src)?;

    let amount_of_processed_entries = Arc::new(Mutex::new(0));
    let (tx, mut rx) = tokio::sync::mpsc::channel::<String>(32);

    let cloned_amount_of_processed_entries = amount_of_processed_entries.clone();
    tokio::select! {
        result = async {
            copy_dir_internal(src, dest, amount_of_processed_entries, &tx)
            .await
            .map_err(|e| {
                tokio::io::Error::new(
                    tokio::io::ErrorKind::InvalidInput,
                    format!("Failed to copy directory: {:?}", e),
                )
            })
        } => result,
        _ = async {
            while let Some(path) = rx.recv().await {
                let processed = *cloned_amount_of_processed_entries.lock().await;
                progress_callback(processed as f32 / amount_of_entries as f32, path);
            }
        } => Ok(()),
    }?;

    if delete_source {
        let guard = DeletionGuard::new(src.clone());
        delete_recursive(src, guard).await?;
    }

    Ok(())
}

fn count_entries(path: &PathBuf) -> Result<u64, std::io::Error> {
    let mut entries = std::fs::read_dir(path)?;

    let mut amount_of_entries = 0;
    while let Some(entry) = entries.next() {
        let entry = entry?;

        if entry.file_type()?.is_dir() {
            amount_of_entries += count_entries(&entry.path())?;
        }

        amount_of_entries += 1;
    }

    Ok(amount_of_entries)
}

async fn copy_dir_internal(
    old_path: &PathBuf,
    new_path: &PathBuf,
    processed_files: Arc<Mutex<u64>>,
    tx: &tokio::sync::mpsc::Sender<String>,
) -> Result<(), tokio::io::Error> {
    let mut entries = tokio::fs::read_dir(old_path).await?;

    while let Some(entry) = entries.next_entry().await? {
        let path = entry.path();

        let filename = path.file_name();
        if filename.is_none() {
            return Err(tokio::io::Error::new(
                tokio::io::ErrorKind::InvalidInput,
                format!("Failed to get filename from path: {}", path.display()),
            ));
        }

        let filename = filename.unwrap().to_str();
        if filename.is_none() {
            return Err(tokio::io::Error::new(
                tokio::io::ErrorKind::InvalidInput,
                format!("Failed to convert filename to string: {}", path.display()),
            ));
        }

        let new_path = new_path.join(filename.unwrap());

        if path.is_dir() {
            if new_path.exists() {
                continue;
            }

            tokio::fs::create_dir(&new_path).await?;

            Box::pin(copy_dir_internal(
                &path,
                &new_path,
                processed_files.clone(),
                tx,
            ))
            .await?;

            *processed_files.lock().await += 1;
            tx.send(path.display().to_string()).await.map_err(|e| {
                tokio::io::Error::new(
                    tokio::io::ErrorKind::InvalidInput,
                    format!("Failed to send path: {:?}", e),
                )
            })?;
        } else {
            let result = tokio::fs::copy(&path, &new_path).await;

            if let Err(e) = result {
                return Err(tokio::io::Error::new(
                    tokio::io::ErrorKind::InvalidInput,
                    format!("Failed to copy file: {:?}", e),
                ));
            }

            *processed_files.lock().await += 1;
            tx.send(path.display().to_string()).await.map_err(|e| {
                tokio::io::Error::new(
                    tokio::io::ErrorKind::InvalidInput,
                    format!("Failed to send path: {:?}", e),
                )
            })?;
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use std::io::Write;

    use super::*;

    fn get_test_dir() -> PathBuf {
        let path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("test/temp");

        if !path.exists() {
            std::fs::create_dir_all(&path).unwrap();
        }

        path
    }

    #[tokio::test]
    async fn test_delete_single_file_success() {
        let dir = get_test_dir();
        let file_path = dir.join("test.txt");

        let mut file = std::fs::File::create(&file_path).unwrap();
        file.write_all(b"test").unwrap();

        let guard = DeletionGuard::new(dir.to_path_buf());
        let result = delete_single_file(&file_path, guard).await;

        assert_eq!(result.unwrap(), ());
        assert!(!file_path.exists());
    }

    #[tokio::test]
    async fn test_delete_single_file_failure() {
        let dir = get_test_dir();
        let file_path = dir.join("test.txt");

        let guard = DeletionGuard::new(dir.join("other_dir"));
        let result = delete_single_file(&file_path, guard).await;

        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_delete_recursive_success() {
        let dir = get_test_dir();
        let sub_dir = dir.join("delete_recursive_success_sub_dir");
        let file_path = sub_dir.join("test.txt");

        std::fs::create_dir_all(&sub_dir).unwrap();
        let mut file = std::fs::File::create(&file_path).unwrap();
        file.write_all(b"test").unwrap();

        let guard = DeletionGuard::new(dir.to_path_buf());
        let result = delete_recursive(&sub_dir, guard).await;

        assert_eq!(result.unwrap(), ());
        assert!(!sub_dir.exists());
    }

    #[tokio::test]
    async fn test_delete_recursive_failure() {
        let dir = get_test_dir();
        let sub_dir = dir.join("delete_recursive_failure_sub_dir");
        let file_path = sub_dir.join("test.txt");

        std::fs::create_dir_all(&sub_dir).unwrap();
        let mut file = std::fs::File::create(&file_path).unwrap();
        file.write_all(b"test").unwrap();

        let guard = DeletionGuard::new(dir.join("other_dir"));
        let result = delete_recursive(&sub_dir, guard).await;

        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_move_file_success() {
        let dir = get_test_dir();
        let src = dir.join("move_file_success_src");
        let dest = dir.join("move_file_success_dest");

        let mut file = std::fs::File::create(&src).unwrap();
        file.write_all(b"test").unwrap();

        if dest.exists() {
            std::fs::remove_file(&dest).unwrap();
        }

        let guard = FileTransferGuard::new(Some(dir.to_path_buf()), Some(dir.to_path_buf()));
        let result = move_file_or_dir(&src, &dest, guard).await;

        assert_eq!(result.unwrap(), ());

        assert!(dest.exists());
        assert!(!src.exists());
    }

    #[tokio::test]
    async fn test_move_dir_success() {
        let dir = get_test_dir();
        let src = dir.join("move_dir_success_src");
        let dest = dir.join("move_dir_success_dest");

        std::fs::create_dir(&src).unwrap();

        if dest.exists() {
            std::fs::remove_dir_all(&dest).unwrap();
        }

        let guard = FileTransferGuard::new(Some(dir.to_path_buf()), Some(dir.to_path_buf()));
        let result = move_file_or_dir(&src, &dest, guard).await;

        assert_eq!(result.unwrap(), ());

        assert!(dest.exists());
        assert!(!src.exists());
    }

    #[tokio::test]
    async fn test_move_file_or_dir_failure() {
        let dir = get_test_dir();
        let src = dir.join("move_file_or_dir_failure_src");
        let dest = dir.join("move_file_or_dir_failure_dest");

        let guard =
            FileTransferGuard::new(Some(dir.join("other_dir")), Some(dir.join("other_dir")));
        let result = move_file_or_dir(&src, &dest, guard).await;

        assert!(result.is_err());
    }

    #[tokio::test]
    async fn test_copy_file_success() {
        let dir = get_test_dir();
        let src = dir.join("copy_file_success_src");
        let dest = dir.join("copy_file_success_dest");

        let mut file = std::fs::File::create(&src).unwrap();
        file.write_all(b"test").unwrap();

        if dest.exists() {
            std::fs::remove_file(&dest).unwrap();
        }

        let guard = FileTransferGuard::new(Some(dir.to_path_buf()), Some(dir.to_path_buf()));
        let result = copy_file(&src, &dest, false, guard).await;

        assert_eq!(result.unwrap(), ());

        assert!(dest.exists());
        assert!(src.exists());
    }

    #[tokio::test]
    async fn test_copy_file_failure() {
        let dir = get_test_dir();
        let src = dir.join("copy_file_failure_src");
        let dest = dir.join("copy_file_failure_dest");

        let guard =
            FileTransferGuard::new(Some(dir.join("other_dir")), Some(dir.join("other_dir")));
        let result = copy_file(&src, &dest, false, guard).await;

        assert!(result.is_err());
    }
}
