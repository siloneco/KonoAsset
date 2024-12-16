use data_store::provider::StoreProvider;
use tauri::{App, Manager};

use commands::{
    filter_by_text, get_all_asset_tags, get_all_supported_avatar_values,
    get_asset_description_from_booth, get_avatar_assets, get_avatar_related_assets,
    get_avatar_related_categories, get_world_assets, open_in_file_manager,
    request_avatar_asset_import, request_avatar_related_asset_import, request_world_asset_import,
};

mod commands;
mod data_store;
mod definitions;
mod fetcher;
mod importer;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(generate_handler())
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

fn generate_handler() -> impl Fn(tauri::ipc::Invoke) -> bool {
    tauri::generate_handler![
        get_avatar_assets,
        get_avatar_related_assets,
        get_world_assets,
        request_avatar_asset_import,
        request_avatar_related_asset_import,
        request_world_asset_import,
        open_in_file_manager,
        get_asset_description_from_booth,
        get_all_asset_tags,
        get_all_supported_avatar_values,
        get_avatar_related_categories,
        filter_by_text
    ]
}
