use logging::LogEntry;

#[tauri::command]
#[specta::specta]
pub fn get_logs() -> Vec<LogEntry> {
    logging::get_logs()
}
