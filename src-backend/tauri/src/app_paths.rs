use std::path::PathBuf;

use tauri::AppHandle;
#[cfg(not(feature = "e2e"))]
use tauri::Manager;

pub fn local_data_dir(app: &AppHandle) -> tauri::Result<PathBuf> {
    #[cfg(feature = "e2e")]
    {
        let _ = app;
        Ok(crate::e2e::root().join("app"))
    }
    #[cfg(not(feature = "e2e"))]
    app.path().app_local_data_dir()
}

pub fn log_dir(app: &AppHandle) -> tauri::Result<PathBuf> {
    #[cfg(feature = "e2e")]
    {
        let _ = app;
        Ok(crate::e2e::root().join("logs"))
    }
    #[cfg(not(feature = "e2e"))]
    app.path().app_log_dir()
}
