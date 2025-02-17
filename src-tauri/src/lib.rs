use std::{borrow::BorrowMut, sync::Arc};

use booth::{fetcher::BoothFetcher, image_resolver::PximgResolver};
use command::generate_tauri_specta_builder;
use data_store::{delete::delete_temporary_images, provider::StoreProvider};
use definitions::entities::{LoadResult, ProgressEvent};
use preference::store::PreferenceStore;
use task::{cancellable_task::TaskContainer, definitions::TaskStatusChanged};
use tauri::{async_runtime::Mutex, Manager};
use tauri_specta::collect_events;
use updater::update_handler::UpdateHandler;

#[cfg(debug_assertions)]
use specta_typescript::{BigIntExportBehavior, Typescript};

mod booth;
mod command;
mod data_store;
mod definitions;
mod file;
mod importer;
mod loader;
mod logging;
mod preference;
mod task;
mod updater;
mod zip;

const VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder =
        generate_tauri_specta_builder().events(collect_events![ProgressEvent, TaskStatusChanged,]);

    #[cfg(debug_assertions)]
    builder
        .export(
            Typescript::default()
                .bigint(BigIntExportBehavior::Number)
                .header("/* eslint-disable */\n// @ts-nocheck"),
            "../src/lib/bindings.ts",
        )
        .expect("Failed to export typescript bindings");

    let mut tauri_builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        tauri_builder = tauri_builder.plugin(tauri_plugin_single_instance::init(|app, _, _| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }));
    }

    tauri_builder
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(builder.invoke_handler())
        .manage(Mutex::new(BoothFetcher::new()))
        .manage(Arc::new(Mutex::new(TaskContainer::new())))
        .setup(move |app| {
            logging::initialize_logger(&app.handle());
            builder.mount_events(app);

            if let Some(window) = app.get_webview_window("main") {
                let result = window.set_title(&format!("KonoAsset v{}", VERSION));

                if result.is_err() {
                    log::warn!("Failed to set window title: {}", result.unwrap_err());
                }
            }

            app.manage(app.handle().clone());

            let app_handle = app.handle().clone();
            let update_handler = tauri::async_runtime::block_on(async move {
                let mut update_handler = UpdateHandler::new(app_handle);
                let result = update_handler.check_for_update().await;

                if result.is_err() {
                    log::error!("Failed to check for update: {}", result.unwrap_err());
                }

                update_handler
            });

            app.manage(update_handler);

            let pref_store = PreferenceStore::load(&app);

            if let Err(err) = pref_store {
                let err = format!("Failed to load preference.json: {}", err.to_string());
                log::error!("{}", err);
                app.manage(LoadResult::error(false, err));
                return Ok(());
            }
            let pref_store = if let Some(item) = pref_store.unwrap() {
                item
            } else {
                let default_pref = PreferenceStore::default(&app);

                if let Err(err) = default_pref {
                    let err = format!("Failed to create default preference: {}", err.to_string());
                    log::error!("{}", err);
                    app.manage(LoadResult::error(false, err));
                    return Ok(());
                }

                default_pref.unwrap()
            };

            let data_dir = pref_store.get_data_dir().clone();

            app.manage(Mutex::new(pref_store));

            app.manage(Arc::new(Mutex::new(PximgResolver::new(
                data_dir.join("images"),
            ))));

            let result = StoreProvider::create(data_dir.clone());

            if let Err(err) = result {
                let err = format!("Failed to create store provider: {}", err.to_string());
                log::error!("{}", err);
                app.manage(LoadResult::error(false, err));
                return Ok(());
            }

            let mut basic_store = result.unwrap();

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

            app.manage(Arc::new(Mutex::new(basic_store)));
            app.manage(LoadResult::success());

            tauri::async_runtime::block_on(async move {
                if let Err(e) = delete_temporary_images(&data_dir).await {
                    log::warn!("Failed to delete temporary images: {}", e);
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
