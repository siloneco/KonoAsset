use commands::{create_asset_and_save, delete_asset_and_save, get_assets};
use data_store::basic_store::BasicStore;
use tauri::{App, Manager};

mod commands;
mod data_store;
mod definitions;
mod factory;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            create_asset_and_save,
            delete_asset_and_save,
            get_assets
        ])
        .setup(|app| {
            let basic_store = init(&app);
            app.manage(basic_store);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init(handler: &App) -> BasicStore {
    let dir = handler.path().app_local_data_dir().unwrap();
    let store = BasicStore::create(dir);

    store.load_from_file();

    store
}
