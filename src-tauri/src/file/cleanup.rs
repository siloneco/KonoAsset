use std::path::PathBuf;

pub struct DeleteOnDrop {
    path: Option<PathBuf>,
}

impl DeleteOnDrop {
    pub fn new(path: PathBuf) -> Self {
        Self { path: Some(path) }
    }

    pub fn mark_as_completed(&mut self) {
        self.path.take();
    }
}

impl Drop for DeleteOnDrop {
    fn drop(&mut self) {
        if let Some(path) = self.path.take() {
            if !path.exists() {
                return;
            }

            if path.is_file() {
                log::debug!("Deleting file: {}", path.display());
                std::fs::remove_file(path).unwrap();
            } else if path.is_dir() {
                log::debug!("Deleting directory: {}", path.display());
                std::fs::remove_dir_all(path).unwrap();
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_delete_on_drop() {
        let path = "test/temp/delete_on_drop";

        if std::fs::exists(&path).unwrap() {
            std::fs::remove_dir_all(&path).unwrap();
        }

        {
            let mut delete_on_drop = DeleteOnDrop::new(PathBuf::from(&path));

            std::fs::create_dir_all(&path).unwrap();
            std::fs::write(format!("{path}/dummy.txt"), b"dummy").unwrap();

            delete_on_drop.mark_as_completed();
        }

        assert!(std::fs::exists(&path).unwrap());

        {
            let _ = DeleteOnDrop::new(PathBuf::from(&path));
        }

        assert!(!std::fs::exists(&path).unwrap());
    }
}
