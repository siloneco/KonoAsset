use std::{path::PathBuf, sync::Arc};

use booth::{BoothFetcher, PximgResolver};
use command::generate_tauri_specta_builder;
use deep_link::{
    definitions::{AddAssetDeepLink, StartupDeepLinkStore},
    execute_deep_links, parse_args_to_deep_links,
};
use definitions::entities::{InitialSetup, LoadResult, ProgressEvent};
use file::modify_guard::{self, FileTransferGuard};
use language::LocalizationData;
use model::preference::{PreferenceStore, UpdateChannel};
use state::StateHandler;
use statistics::{AssetVolumeEstimatedEvent, AssetVolumeStatisticsCache};
use storage::{asset_storage::AssetStorage, delete::delete_temporary_images};
use task::{TaskContainer, TaskStatusChanged};
use tauri::{AppHandle, Manager, async_runtime::Mutex};
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_plugin_window_state::StateFlags;
use tauri_specta::{Event, collect_events};
use updater::update_handler::{UpdateHandler, UpdateProgress};

#[cfg(debug_assertions)]
use specta_typescript::{BigIntExportBehavior, Typescript};

mod adapter;
mod command;
mod deep_link;
mod definitions;
mod importer;
mod statistics;
mod updater;

const VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = generate_tauri_specta_builder().events(collect_events![
        ProgressEvent,
        TaskStatusChanged,
        AddAssetDeepLink,
        UpdateProgress,
        AssetVolumeEstimatedEvent,
    ]);

    #[cfg(debug_assertions)]
    builder
        .export(
            Typescript::default()
                .bigint(BigIntExportBehavior::Number)
                .header("/* eslint-disable */\n// @ts-nocheck"),
            "../../src/lib/bindings.ts",
        )
        .expect("Failed to export typescript bindings");

    let mut tauri_builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        tauri_builder = tauri_builder.plugin(tauri_plugin_single_instance::init(|app, args, _| {
            let window = app.get_webview_window("main").expect("no main window");

            let _ = window.unminimize();
            let _ = window.set_focus();

            let deep_links = parse_args_to_deep_links(&args);
            execute_deep_links(&app, &deep_links);
        }));
    }

    tauri_builder
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(
            tauri_plugin_window_state::Builder::new()
                .with_state_flags(StateFlags::SIZE | StateFlags::MAXIMIZED)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_deep_link::init())
        .invoke_handler(builder.invoke_handler())
        .manage(Mutex::new(BoothFetcher::new(VERSION)))
        .manage(arc_mutex(LocalizationData::default()))
        .manage(arc_mutex(AssetVolumeStatisticsCache::new()))
        .setup(move |app| {
            logging::initialize_logger(app.path().app_log_dir().unwrap());
            builder.mount_events(app);

            set_window_title(app.handle(), format!("KonoAsset v{}", VERSION));

            app.manage(app.handle().clone());

            let app_handle = app.handle().clone();
            app.manage(arc_mutex(TaskContainer::new(Arc::new(
                move |id, status| {
                    if let Err(e) = TaskStatusChanged::new(id, status).emit(&app_handle) {
                        log::error!("Failed to emit TaskStatusChanged event: {}", e);
                    }
                },
            ))));

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

            let app_local_data_dir = app.path().app_local_data_dir().unwrap();
            let preference_file_path = app_local_data_dir.join("preference.json");
            let state_file_path = app_local_data_dir.join("state.json");

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
            let state_handler = StateHandler::load_or_default(state_file_path);

            let pximg_resolver = PximgResolver::new(data_dir.join("images"), VERSION);

            app.manage(arc_mutex(pref_store));
            app.manage(arc_mutex(pximg_resolver));
            app.manage(arc_mutex(get_update_handler(
                app.handle().clone(),
                &update_channel,
            )));
            app.manage(arc_mutex(state_handler));

            let result = load_store_provider(&data_dir, &app_local_data_dir);
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
    let preference_path = app
        .path()
        .app_local_data_dir()
        .unwrap()
        .join("preference.json");
    let document_dir = app.path().document_dir().unwrap();

    let pref_store = loader::wrapper::load_preference_store(preference_path, document_dir);

    if let Err(err) = pref_store {
        return Err(format!(
            "Failed to load preference.json: {}",
            err.to_string()
        ));
    }

    Ok(pref_store.unwrap())
}

fn load_store_provider(
    data_dir: &PathBuf,
    app_local_dir: &PathBuf,
) -> Result<AssetStorage, String> {
    let result = AssetStorage::create(data_dir);

    if let Err(err) = result {
        return Err(format!("Failed to create store provider: {}", err));
    }

    let mut store_provider = result.unwrap();
    let store_provider_ref = &mut store_provider;

    let metadata_backup_dir = app_local_dir.join("backups").join("metadata");

    let result = tauri::async_runtime::block_on(async move {
        if let Err(e) = migrate_legacy_backup_dir(store_provider_ref, &metadata_backup_dir).await {
            log::error!("Failed to migrate legacy backup dir: {}", e);
        }

        store_provider_ref
            .create_backup(metadata_backup_dir)
            .await?;
        store_provider_ref.load_all_assets_from_files().await
    });

    if let Err(err) = result {
        return Err(format!("Failed to load metadata: {}", err));
    }

    Ok(store_provider)
}

async fn migrate_legacy_backup_dir(
    provider: &AssetStorage,
    metadata_backup_dir: &PathBuf,
) -> Result<(), String> {
    let data_dir = provider.data_dir();
    let legacy_metadata_backup_dir = data_dir.join("metadata").join("backups");

    if !legacy_metadata_backup_dir.exists() {
        return Ok(());
    }

    modify_guard::copy_dir(
        legacy_metadata_backup_dir,
        metadata_backup_dir.clone(),
        true,
        FileTransferGuard::src(data_dir),
        |_, _| {},
    )
    .await
    .map_err(|e| format!("Failed to migrate legacy metadata backup directory: {}", e))?;

    Ok(())
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
