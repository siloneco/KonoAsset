use std::path::PathBuf;

pub struct DeletionGuard {
    must_be_parent: PathBuf,
}

impl DeletionGuard {
    pub fn new(must_be_parent: PathBuf) -> Self {
        Self { must_be_parent }
    }

    fn assert(&self, path: &PathBuf) -> Result<(), std::io::Error> {
        let parent_absolute = std::path::absolute(&self.must_be_parent).map_err(|e| {
            std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                format!("Failed to convert parent path to absolute path: {:?}", e),
            )
        })?;

        let path_absolute = std::path::absolute(path).map_err(|e| {
            std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                format!("Failed to convert path to absolute path: {:?}", e),
            )
        })?;

        if !path_absolute.starts_with(&parent_absolute) {
            return Err(std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
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

pub fn delete_single_file(path: &PathBuf, guard: DeletionGuard) -> Result<(), std::io::Error> {
    guard.assert(path)?;
    std::fs::remove_file(path)
}

pub fn delete_recursive(path: &PathBuf, guard: DeletionGuard) -> Result<(), std::io::Error> {
    guard.assert(path)?;

    let canonicalized = path.canonicalize()?;

    if canonicalized.is_dir() {
        std::fs::remove_dir_all(path)
    } else {
        std::fs::remove_file(path)
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

    fn assert(&self, src: &PathBuf, dest: &PathBuf) -> Result<(), std::io::Error> {
        if let Some(src_must_be_parent) = &self.src_must_be_parent {
            let src_must_be_parent_absolute =
                std::path::absolute(src_must_be_parent).map_err(|e| {
                    std::io::Error::new(
                        std::io::ErrorKind::InvalidInput,
                        format!(
                            "Failed to convert source parent path to absolute path: {:?}",
                            e
                        ),
                    )
                })?;

            let src_absolute = std::path::absolute(src).map_err(|e| {
                std::io::Error::new(
                    std::io::ErrorKind::InvalidInput,
                    format!("Failed to convert source path to absolute path: {:?}", e),
                )
            })?;

            if !src_absolute.starts_with(&src_must_be_parent_absolute) {
                return Err(std::io::Error::new(
                    std::io::ErrorKind::InvalidInput,
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
                    std::io::Error::new(
                        std::io::ErrorKind::InvalidInput,
                        format!(
                            "Failed to convert destination parent path to absolute path: {:?}",
                            e
                        ),
                    )
                })?;

            let dest_absolute = std::path::absolute(dest).map_err(|e| {
                std::io::Error::new(
                    std::io::ErrorKind::InvalidInput,
                    format!(
                        "Failed to convert destination path to absolute path: {:?}",
                        e
                    ),
                )
            })?;

            if !dest_absolute.starts_with(&dest_must_be_parent_absolute) {
                return Err(std::io::Error::new(
                    std::io::ErrorKind::InvalidInput,
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

pub fn move_file_or_dir(
    src: &PathBuf,
    dest: &PathBuf,
    guard: FileTransferGuard,
) -> Result<(), std::io::Error> {
    guard.assert(src, dest)?;
    std::fs::rename(src, dest)
}

pub fn copy_file(
    src: &PathBuf,
    dest: &PathBuf,
    delete_source: bool,
    guard: FileTransferGuard,
) -> Result<(), std::io::Error> {
    if !src.is_file() {
        return Err(std::io::Error::new(
            std::io::ErrorKind::InvalidInput,
            "Source path must be a file",
        ));
    }

    guard.assert(src, dest)?;
    std::fs::copy(src, dest)?;

    if delete_source {
        let guard = DeletionGuard::new(src.clone());
        delete_single_file(src, guard)?;
    }

    Ok(())
}

pub fn copy_dir(
    src: &PathBuf,
    dest: &PathBuf,
    delete_source: bool,
    guard: FileTransferGuard,
) -> Result<(), std::io::Error> {
    if !src.is_dir() {
        return Err(std::io::Error::new(
            std::io::ErrorKind::InvalidInput,
            "Source path must be a directory",
        ));
    }

    if !dest.exists() {
        if let Err(e) = std::fs::create_dir_all(&dest) {
            return Err(std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                format!("Failed to create destination directory: {:?}", e),
            ));
        }
    }

    guard.assert(src, dest)?;

    copy_dir_internal(src, dest)?;

    if delete_source {
        let guard = DeletionGuard::new(src.clone());
        delete_recursive(src, guard)?;
    }

    Ok(())
}

fn copy_dir_internal(old_path: &PathBuf, new_path: &PathBuf) -> Result<(), std::io::Error> {
    std::fs::create_dir_all(new_path)?;

    for entry in std::fs::read_dir(old_path).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();

        let new_path = new_path.join(path.file_name().unwrap());

        if path.is_dir() {
            copy_dir_internal(&path, &new_path)?;
        } else {
            let result = std::fs::copy(&path, &new_path);

            if let Err(e) = result {
                return Err(std::io::Error::new(
                    std::io::ErrorKind::InvalidInput,
                    format!("Failed to copy file: {:?}", e),
                ));
            }
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::File;
    use std::io::Write;

    fn get_test_dir() -> PathBuf {
        let path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("test/temp");

        if !path.exists() {
            std::fs::create_dir_all(&path).unwrap();
        }

        path
    }

    #[test]
    fn test_delete_single_file_success() {
        let dir = get_test_dir();
        let file_path = dir.join("test.txt");

        let mut file = File::create(&file_path).unwrap();
        file.write_all(b"test").unwrap();

        let guard = DeletionGuard::new(dir.to_path_buf());
        delete_single_file(&file_path, guard).unwrap();

        assert!(!file_path.exists());
    }

    #[test]
    fn test_delete_single_file_failure() {
        let dir = get_test_dir();
        let file_path = dir.join("test.txt");

        let guard = DeletionGuard::new(dir.join("other_dir"));
        let result = delete_single_file(&file_path, guard);

        assert!(result.is_err());
    }

    #[test]
    fn test_delete_recursive_success() {
        let dir = get_test_dir();
        let sub_dir = dir.join("delete_recursive_success_sub_dir");
        let file_path = sub_dir.join("test.txt");

        std::fs::create_dir_all(&sub_dir).unwrap();
        let mut file = File::create(&file_path).unwrap();
        file.write_all(b"test").unwrap();

        let guard = DeletionGuard::new(dir.to_path_buf());
        delete_recursive(&sub_dir, guard).unwrap();

        assert!(!sub_dir.exists());
    }

    #[test]
    fn test_delete_recursive_failure() {
        let dir = get_test_dir();
        let sub_dir = dir.join("delete_recursive_failure_sub_dir");
        let file_path = sub_dir.join("test.txt");

        std::fs::create_dir_all(&sub_dir).unwrap();
        let mut file = File::create(&file_path).unwrap();
        file.write_all(b"test").unwrap();

        let guard = DeletionGuard::new(dir.join("other_dir"));
        let result = delete_recursive(&sub_dir, guard);

        assert!(result.is_err());
    }

    #[test]
    fn test_move_file_success() {
        let dir = get_test_dir();
        let src = dir.join("move_file_success_src");
        let dest = dir.join("move_file_success_dest");

        let mut file = File::create(&src).unwrap();
        file.write_all(b"test").unwrap();

        if dest.exists() {
            std::fs::remove_file(&dest).unwrap();
        }

        let guard = FileTransferGuard::new(Some(dir.to_path_buf()), Some(dir.to_path_buf()));
        move_file_or_dir(&src, &dest, guard).unwrap();

        assert!(dest.exists());
        assert!(!src.exists());
    }

    #[test]
    fn test_move_dir_success() {
        let dir = get_test_dir();
        let src = dir.join("move_dir_success_src");
        let dest = dir.join("move_dir_success_dest");

        std::fs::create_dir(&src).unwrap();

        if dest.exists() {
            std::fs::remove_dir_all(&dest).unwrap();
        }

        let guard = FileTransferGuard::new(Some(dir.to_path_buf()), Some(dir.to_path_buf()));
        move_file_or_dir(&src, &dest, guard).unwrap();

        assert!(dest.exists());
        assert!(!src.exists());
    }

    #[test]
    fn test_move_file_or_dir_failure() {
        let dir = get_test_dir();
        let src = dir.join("move_file_or_dir_failure_src");
        let dest = dir.join("move_file_or_dir_failure_dest");

        let guard =
            FileTransferGuard::new(Some(dir.join("other_dir")), Some(dir.join("other_dir")));
        let result = move_file_or_dir(&src, &dest, guard);

        assert!(result.is_err());
    }

    #[test]
    fn test_copy_file_success() {
        let dir = get_test_dir();
        let src = dir.join("copy_file_success_src");
        let dest = dir.join("copy_file_success_dest");

        let mut file = File::create(&src).unwrap();
        file.write_all(b"test").unwrap();

        if dest.exists() {
            std::fs::remove_file(&dest).unwrap();
        }

        let guard = FileTransferGuard::new(Some(dir.to_path_buf()), Some(dir.to_path_buf()));
        copy_file(&src, &dest, false, guard).unwrap();

        assert!(dest.exists());
        assert!(src.exists());
    }

    #[test]
    fn test_copy_file_failure() {
        let dir = get_test_dir();
        let src = dir.join("copy_file_failure_src");
        let dest = dir.join("copy_file_failure_dest");

        let guard =
            FileTransferGuard::new(Some(dir.join("other_dir")), Some(dir.join("other_dir")));
        let result = copy_file(&src, &dest, false, guard);

        assert!(result.is_err());
    }
}
