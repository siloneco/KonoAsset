//! Only compiled into the dedicated E2E binary. Never fall back to real user data.
use std::{path::PathBuf, sync::OnceLock};

pub fn root() -> &'static PathBuf {
    static ROOT: OnceLock<PathBuf> = OnceLock::new();
    ROOT.get_or_init(|| {
        let path =
            PathBuf::from(std::env::var_os("E2E_ROOT").expect("E2E builds require E2E_ROOT"));
        assert!(path.is_absolute() && path.is_dir(), "Invalid E2E root");
        path
    })
}

pub fn configure_context(mut context: tauri::Context<tauri::Wry>) -> tauri::Context<tauri::Wry> {
    // Build the window in setup so its WebView uses an absolute, per-test path.
    for window in &mut context.config_mut().app.windows {
        window.create = false;
    }
    context
}

pub fn create_window(app: &tauri::App) -> tauri::Result<()> {
    tauri::WebviewWindowBuilder::from_config(app, &app.config().app.windows[0])?
        .data_directory(root().join("webview"))
        .build()?;
    Ok(())
}
