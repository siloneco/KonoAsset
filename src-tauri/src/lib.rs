use std::path::PathBuf;

use booth::fetcher::BoothFetcher;
use commands::generate_tauri_specta_builder;
use data_store::{delete::delete_temporary_images, provider::StoreProvider};
use preference::store::PreferenceStore;
use tauri::{async_runtime::Mutex, App, Manager};
use updater::update_handler::UpdateHandler;

#[cfg(debug_assertions)]
use specta_typescript::{BigIntExportBehavior, Typescript};

mod booth;
mod commands;
mod data_store;
mod definitions;
mod file_opener;
mod importer;
mod preference;
mod updater;

const VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = generate_tauri_specta_builder();

    #[cfg(debug_assertions)]
    builder
        .export(
            Typescript::default()
                .bigint(BigIntExportBehavior::Number)
                .header("/* eslint-disable */\n// @ts-nocheck"),
            "../src/lib/bindings.ts",
        )
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(builder.invoke_handler())
        .manage(Mutex::new(BoothFetcher::new()))
        .setup(|app| {
            let pref_store = PreferenceStore::load(&app);

            if pref_store.is_err() {
                return Err(format!(
                    "Failed to load preference store: {}",
                    pref_store.unwrap_err().to_string()
                )
                .into());
            }

            let pref_store = pref_store
                .unwrap()
                .unwrap_or(PreferenceStore::default(&app));
            let data_dir = pref_store.get_data_dir().clone();

            app.manage(Mutex::new(pref_store));

            let basic_store = generate_store_provider(data_dir.clone());

            let basic_store = tauri::async_runtime::block_on(async move {
                let result = basic_store.load_all_assets_from_files().await;

                if result.is_err() {
                    eprintln!("Failed to load assets from files: {}", result.unwrap_err());
                }

                basic_store
            });

            app.manage(Mutex::new(basic_store));

            let app_handle = app.handle().clone();
            let update_handler = tauri::async_runtime::block_on(async move {
                let mut update_handler = UpdateHandler::new(app_handle);
                let result = update_handler.check_for_update().await;

                if result.is_err() {
                    eprintln!("Failed to check for update: {}", result.unwrap_err());
                }

                update_handler
            });

            app.manage(update_handler);

            init(&app, &data_dir);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init(handler: &App, data_dir: &PathBuf) {
    handler
        .get_webview_window("main")
        .unwrap()
        .set_title(&format!("KonoAsset v{}", VERSION))
        .unwrap();

    let result = delete_temporary_images(data_dir);
    if result.is_err() {
        eprintln!("Failed to delete temporary images: {}", result.unwrap_err());
    }
}

fn generate_store_provider(data_dir_path: PathBuf) -> StoreProvider {
    StoreProvider::create(data_dir_path)
}
