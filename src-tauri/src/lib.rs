use std::{path::PathBuf, sync::Arc};

use booth::{fetcher::BoothFetcher, image_resolver::PximgResolver};
use command::generate_tauri_specta_builder;
use data_store::{delete::delete_temporary_images, provider::StoreProvider};
use definitions::entities::{LoadResult, ProgressEvent};
use preference::store::PreferenceStore;
use task::{cancellable_task::TaskContainer, definitions::TaskStatusChanged};
use tauri::{async_runtime::Mutex, AppHandle, Manager};
use tauri_specta::collect_events;
use updater::update_handler::{UpdateChannel, UpdateHandler};

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

            set_window_title(app.handle(), format!("KonoAsset v{}", VERSION));

            app.manage(app.handle().clone());

            let result = load_preference_store(app.handle());
            if let Err(e) = result {
                log::error!("{}", e);
                app.manage(LoadResult::error(false, e));

                // Err を返すとアプリケーションが終了してしまうため Ok を返す
                return Ok(());
            }

            let pref_store = result.unwrap();
            let data_dir = pref_store.get_data_dir().clone();
            let update_channel = pref_store.update_channel.clone();

            let pximg_resolver = PximgResolver::new(data_dir.join("images"));

            app.manage(arc_mutex(pref_store));
            app.manage(arc_mutex(pximg_resolver));
            app.manage(arc_mutex(get_update_handler(
                app.handle().clone(),
                &update_channel,
            )));

            let result = load_store_provider(&data_dir);
            if let Err(err) = result {
                log::error!("{}", err);
                app.manage(LoadResult::error(true, err));

                // Err を返すとアプリケーションが終了してしまうため Ok を返す
                return Ok(());
            }

            let store_provider = result.unwrap();

            app.manage(arc_mutex(store_provider));
            app.manage(LoadResult::success());

            cleanup_images_dir(&data_dir);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn set_window_title<S>(app: &AppHandle, title: S)
where
    S: AsRef<str>,
{
    if let Some(window) = app.get_webview_window("main") {
        let result = window.set_title(title.as_ref());

        if result.is_err() {
            log::warn!("Failed to set window title: {}", result.unwrap_err());
        }
    }
}

fn get_update_handler(app: AppHandle, channel: &UpdateChannel) -> UpdateHandler {
    tauri::async_runtime::block_on(async move {
        let mut update_handler = UpdateHandler::new(app);
        let result = update_handler.check_for_update(channel).await;

        if result.is_err() {
            log::error!("Failed to check for update: {}", result.unwrap_err());
        }

        update_handler
    })
}

fn load_preference_store(app: &AppHandle) -> Result<PreferenceStore, String> {
    let pref_store = PreferenceStore::load(app);

    if let Err(err) = pref_store {
        return Err(format!(
            "Failed to load preference.json: {}",
            err.to_string()
        ));
    }

    let pref_store = pref_store.unwrap();

    if let Some(pref_store) = pref_store {
        return Ok(pref_store);
    }

    let default_pref = PreferenceStore::default(&app);

    if let Err(err) = default_pref {
        return Err(format!("Failed to create default preference: {}", err));
    }

    Ok(default_pref.unwrap())
}

fn load_store_provider(data_dir: &PathBuf) -> Result<StoreProvider, String> {
    let result = StoreProvider::create(data_dir);

    if let Err(err) = result {
        return Err(format!("Failed to create store provider: {}", err));
    }

    let mut store_provider = result.unwrap();
    let store_provider_ref = &mut store_provider;

    let result = tauri::async_runtime::block_on(async move {
        store_provider_ref.load_all_assets_from_files().await
    });

    if let Err(err) = result {
        return Err(format!("Failed to load metadata: {}", err));
    }

    Ok(store_provider)
}

fn cleanup_images_dir(data_dir: &PathBuf) {
    tauri::async_runtime::block_on(async move {
        if let Err(e) = delete_temporary_images(data_dir).await {
            log::warn!("Failed to delete temporary images: {}", e);
        }
    });
}

fn arc_mutex<T>(value: T) -> Arc<Mutex<T>> {
    Arc::new(Mutex::new(value))
}
