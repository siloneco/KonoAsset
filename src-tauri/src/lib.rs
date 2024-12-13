use commands::{
    get_asset_description_from_booth, get_avatar_assets, get_avatar_related_assets,
    get_world_assets, open_in_file_manager, request_avatar_asset_import,
};
use data_store::provider::StoreProvider;
use tauri::{App, Manager};

mod commands;
mod data_store;
mod definitions;
mod fetcher;
mod files;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_avatar_assets,
            get_avatar_related_assets,
            get_world_assets,
            request_avatar_asset_import,
            open_in_file_manager,
            get_asset_description_from_booth
        ])
        .setup(|app| {
            let basic_store = init(&app);
            app.manage(basic_store);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init(handler: &App) -> StoreProvider {
    let dir = handler.path().app_local_data_dir().unwrap();
    let store = StoreProvider::create(dir);

    let result = store.load_all_assets_from_files();

    if result.is_err() {
        eprintln!("Failed to load assets from files: {}", result.unwrap_err());
    }

    store
}
