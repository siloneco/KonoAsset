use std::{borrow::BorrowMut, path::PathBuf};

use booth::fetcher::BoothFetcher;
use command::generate_tauri_specta_builder;
use data_store::{delete::delete_temporary_images, provider::StoreProvider};
use definitions::entities::LoadResult;
use preference::store::PreferenceStore;
use tauri::{async_runtime::Mutex, Manager};
use updater::update_handler::UpdateHandler;

#[cfg(debug_assertions)]
use specta_typescript::{BigIntExportBehavior, Typescript};

mod booth;
mod command;
mod data_store;
mod definitions;
mod file_opener;
mod importer;
mod loader;
mod logging;
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
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(builder.invoke_handler())
        .manage(Mutex::new(BoothFetcher::new()))
        .setup(|app| {
            app.get_webview_window("main")
                .unwrap()
                .set_title(&format!("KonoAsset v{}", VERSION))
                .unwrap();

            app.manage(app.handle().clone());

            logging::initialize_logger(&app.handle());

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

            let pref_store = PreferenceStore::load(&app);

            if pref_store.is_err() {
                let err = format!(
                    "Failed to load preference.json: {}",
                    pref_store.unwrap_err().to_string()
                );
                log::error!("{}", err);
                app.manage(LoadResult::error(false, err));
                return Ok(());
            }

            let pref_store = pref_store
                .unwrap()
                .unwrap_or(PreferenceStore::default(&app));
            let data_dir = pref_store.get_data_dir().clone();

            app.manage(Mutex::new(pref_store));

            let mut basic_store = generate_store_provider(data_dir.clone());

            let app_handle = app.handle().clone();
            let basic_store_ref = basic_store.borrow_mut();
            let basic_store_load_result = tauri::async_runtime::block_on(async move {
                basic_store_ref.load_all_assets_from_files().await
            });

            if basic_store_load_result.is_err() {
                let err = format!(
                    "Failed to load metadata: {}",
                    basic_store_load_result.unwrap_err()
                );
                log::error!("{}", err);
                app_handle.manage(LoadResult::error(true, err));

                return Ok(());
            }

            app.manage(Mutex::new(basic_store));
            app.manage(LoadResult::success());

            let result = delete_temporary_images(&data_dir);
            if result.is_err() {
                log::warn!("Failed to delete temporary images: {}", result.unwrap_err());
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
fn generate_store_provider(data_dir_path: PathBuf) -> StoreProvider {
    StoreProvider::create(data_dir_path)
}
