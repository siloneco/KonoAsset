use std::{path::PathBuf, sync::Arc};

use booth::{fetcher::BoothFetcher, image_resolver::PximgResolver};
use command::generate_tauri_specta_builder;
use data_store::{delete::delete_temporary_images, provider::StoreProvider};
use deep_link::{
    definitions::{AddAssetDeepLink, StartupDeepLinkStore},
    execute_deep_links, parse_args_to_deep_links,
};
use definitions::entities::{InitialSetup, LoadResult, ProgressEvent};
use language::{load::load_from_language_code, structs::LanguageCode};
use preference::store::PreferenceStore;
use task::{cancellable_task::TaskContainer, definitions::TaskStatusChanged};
use tauri::{async_runtime::Mutex, AppHandle, Manager};
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_specta::collect_events;
use updater::update_handler::{UpdateChannel, UpdateHandler, UpdateProgress};

#[cfg(debug_assertions)]
use specta_typescript::{BigIntExportBehavior, Typescript};

mod adapter;
mod booth;
mod command;
mod data_store;
mod deep_link;
mod definitions;
mod file;
mod importer;
mod language;
mod loader;
mod logging;
mod preference;
mod task;
mod updater;
mod zip;

const VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = generate_tauri_specta_builder().events(collect_events![
        ProgressEvent,
        TaskStatusChanged,
        AddAssetDeepLink,
        UpdateProgress,
    ]);

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
        tauri_builder = tauri_builder.plugin(tauri_plugin_single_instance::init(|app, args, _| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();

            let deep_links = parse_args_to_deep_links(&args);
            execute_deep_links(&app, &deep_links);
        }));
    }

    tauri_builder
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_deep_link::init())
        .invoke_handler(builder.invoke_handler())
        .manage(Mutex::new(BoothFetcher::new()))
        .manage(Arc::new(Mutex::new(TaskContainer::new())))
        .setup(move |app| {
            logging::initialize_logger(&app.handle());
            builder.mount_events(app);

            set_window_title(app.handle(), format!("KonoAsset v{}", VERSION));

            app.manage(app.handle().clone());

            #[cfg(any(windows, target_os = "linux"))]
            {
                if let Err(e) = app.deep_link().register_all() {
                    log::error!("Failed to register deep links: {}", e);
                }
            }

            let args = std::env::args().collect::<Vec<_>>();
            let deep_links = parse_args_to_deep_links(&args);
            let deep_links = StartupDeepLinkStore::new(deep_links);

            app.manage(arc_mutex(deep_links));

            let default_language_data = load_from_language_code(LanguageCode::EnUs);
            if let Err(e) = default_language_data {
                log::error!("{}", e);
                app.manage(LoadResult::error(false, e));

                // Err を返すとアプリケーションが終了してしまうため Ok を返す
                return Ok(());
            }
            let default_language_data = default_language_data.unwrap();
            let lang_state = arc_mutex(default_language_data);

            app.manage(lang_state.clone());

            let preference_file_path = app
                .path()
                .app_local_data_dir()
                .unwrap()
                .join("preference.json");
            app.manage(arc_mutex(InitialSetup::new(preference_file_path)));

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
            let language_code = pref_store.language.clone();

            let pximg_resolver = PximgResolver::new(data_dir.join("images"));

            app.manage(arc_mutex(pref_store));
            app.manage(arc_mutex(pximg_resolver));
            app.manage(arc_mutex(get_update_handler(
                app.handle().clone(),
                &update_channel,
            )));

            let language_data = load_from_language_code(language_code);
            if let Err(err) = language_data {
                log::error!("{}", err);
                app.manage(LoadResult::error(false, err));

                // Err を返すとアプリケーションが終了してしまうため Ok を返す
                return Ok(());
            }

            *lang_state.blocking_lock() = language_data.unwrap();

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
        store_provider_ref.load_all_assets_from_files(true).await
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
