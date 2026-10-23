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

// Replace only the native picker boundary. The renderer still uses plugin-dialog
// over IPC, and all subsequent import/export work runs through the real backend.
// Responses are prepared before startup and must remain inside this run's root.
pub fn dialog_plugin() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    tauri::plugin::Builder::new("dialog")
        .invoke_handler(tauri::generate_handler![open, save])
        .build()
}

#[derive(serde::Deserialize, serde::Serialize)]
struct PickerResponse {
    kind: String,
    directory: Option<bool>,
    multiple: Option<bool>,
    response: serde_json::Value,
}

fn picker_response(kind: &str, options: serde_json::Value) -> Result<serde_json::Value, String> {
    use std::{collections::VecDeque, sync::Mutex};
    static LOCK: Mutex<()> = Mutex::new(());
    let _guard = LOCK.lock().map_err(|e| e.to_string())?;
    let queue_path = root().join("pickers.json");
    let mut queue: VecDeque<PickerResponse> = serde_json::from_slice(
        &std::fs::read(&queue_path).map_err(|e| format!("Missing E2E picker responses: {e}"))?,
    )
    .map_err(|e| e.to_string())?;
    let next = queue
        .pop_front()
        .ok_or("Unexpected native picker request")?;
    if next.kind != kind
        || next
            .directory
            .is_some_and(|expected| options["directory"].as_bool().unwrap_or(false) != expected)
        || next
            .multiple
            .is_some_and(|expected| options["multiple"].as_bool().unwrap_or(false) != expected)
    {
        return Err(format!("Unexpected picker: {kind} {options}"));
    }
    let paths: Vec<&str> = match &next.response {
        serde_json::Value::Null => vec![],
        serde_json::Value::String(s) => vec![s],
        serde_json::Value::Array(items) => items
            .iter()
            .map(|v| v.as_str().ok_or("Invalid picker path"))
            .collect::<Result<_, _>>()?,
        _ => return Err("Invalid picker response".into()),
    };
    for path in paths {
        let path = std::path::Path::new(path);
        if !path.is_absolute()
            || !path.starts_with(root())
            || path
                .components()
                .any(|part| matches!(part, std::path::Component::ParentDir))
        {
            return Err("E2E picker path must stay within E2E_ROOT".into());
        }
    }
    std::fs::write(
        queue_path,
        serde_json::to_vec(&queue).map_err(|e| e.to_string())?,
    )
    .map_err(|e| e.to_string())?;
    Ok(next.response)
}

#[tauri::command]
async fn open(options: serde_json::Value) -> Result<serde_json::Value, String> {
    picker_response("open", options)
}

#[tauri::command]
async fn save(options: serde_json::Value) -> Result<serde_json::Value, String> {
    picker_response("save", options)
}
