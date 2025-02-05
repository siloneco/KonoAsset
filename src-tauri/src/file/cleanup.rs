use std::path::PathBuf;

pub struct DeleteDirOnDrop {
    path: Option<PathBuf>,
}

impl DeleteDirOnDrop {
    pub fn new(path: PathBuf) -> Self {
        Self { path: Some(path) }
    }

    pub fn mark_as_completed(&mut self) {
        self.path.take();
    }
}

impl Drop for DeleteDirOnDrop {
    fn drop(&mut self) {
        if let Some(path) = self.path.take() {
            if !path.exists() {
                return;
            }

            log::debug!("Deleting directory: {}", path.display());
            std::fs::remove_dir_all(path).unwrap();
        }
    }
}
