use commands::generate_tauri_specta_builder;
use specta_typescript::{BigIntExportBehavior, Typescript};

use booth::fetcher::BoothFetcher;
use data_store::{delete::delete_temporary_images, provider::StoreProvider};
use tauri::{async_runtime::Mutex, App, Manager};
use updater::update_handler::UpdateHandler;

mod booth;
mod commands;
mod data_store;
mod definitions;
mod file_opener;
mod importer;
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
        .setup(|app| {
            let basic_store = generate_store_provider(&app);

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

            init(&app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init(handler: &App) {
    handler
        .get_webview_window("main")
        .unwrap()
        .set_title(&format!("KonoAsset v{}", VERSION))
        .unwrap();

    let result = delete_temporary_images(&handler.path().app_local_data_dir().unwrap());
    if result.is_err() {
        eprintln!("Failed to delete temporary images: {}", result.unwrap_err());
    }

    handler.manage(Mutex::new(BoothFetcher::new()));
}

fn generate_store_provider(handler: &App) -> StoreProvider {
    StoreProvider::create(handler.path().app_local_data_dir().unwrap())
}
