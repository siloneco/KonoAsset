use std::path::PathBuf;

pub struct DeletionGuard {
    must_be_parent: PathBuf,
}

impl DeletionGuard {
    pub fn new(must_be_parent: PathBuf) -> Self {
        Self { must_be_parent }
    }

    fn assert(&self, path: &PathBuf) -> Result<(), std::io::Error> {
        let parent_canonicalized_result = self.must_be_parent.canonicalize();

        if let Err(e) = parent_canonicalized_result {
            return Err(std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                format!("Failed to canonicalize parent path: {:?}", e),
            ));
        }

        let parent_canonicalized = parent_canonicalized_result.unwrap();
        let path_canonicalized = path.canonicalize()?;

        if !path_canonicalized.starts_with(&parent_canonicalized) {
            return Err(std::io::Error::new(
                std::io::ErrorKind::InvalidInput,
                format!(
                    "Path {} is not a child of {}",
                    path_canonicalized.display(),
                    parent_canonicalized.display()
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
            let src_must_be_parent_canonicalized_result = src_must_be_parent.canonicalize();

            if let Err(e) = src_must_be_parent_canonicalized_result {
                return Err(std::io::Error::new(
                    std::io::ErrorKind::InvalidInput,
                    format!("Failed to canonicalize source parent path: {:?}", e),
                ));
            }

            let src_must_be_parent_canonicalized = src_must_be_parent_canonicalized_result.unwrap();
            let src_canonicalized = src.canonicalize()?;

            if !src_canonicalized.starts_with(&src_must_be_parent_canonicalized) {
                return Err(std::io::Error::new(
                    std::io::ErrorKind::InvalidInput,
                    format!(
                        "Source path {:?} is not a child of {:?}",
                        src_canonicalized, src_must_be_parent_canonicalized
                    ),
                ));
            }
        }

        if let Some(dest_must_be_parent) = &self.dest_must_be_parent {
            let dest_must_be_parent_canonicalized_result = dest_must_be_parent.canonicalize();

            if let Err(e) = dest_must_be_parent_canonicalized_result {
                return Err(std::io::Error::new(
                    std::io::ErrorKind::InvalidInput,
                    format!("Failed to canonicalize destination parent path: {:?}", e),
                ));
            }

            let dest_must_be_parent_canonicalized =
                dest_must_be_parent_canonicalized_result.unwrap();
            let dest_canonicalized = dest.canonicalize()?;

            if !dest_canonicalized.starts_with(&dest_must_be_parent_canonicalized) {
                return Err(std::io::Error::new(
                    std::io::ErrorKind::InvalidInput,
                    format!(
                        "Destination path {} is not a child of {}",
                        dest_canonicalized.display(),
                        dest_must_be_parent_canonicalized.display()
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
