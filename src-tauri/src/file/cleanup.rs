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
