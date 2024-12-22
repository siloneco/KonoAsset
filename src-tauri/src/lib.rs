use data_store::{delete::delete_temporary_images, provider::StoreProvider};
use tauri::{App, Manager};

use commands::{
    check_for_update, copy_image_file_to_images, do_not_notify_update, execute_update,
    get_all_asset_tags, get_all_supported_avatar_values, get_asset,
    get_asset_description_from_booth, get_avatar_related_categories,
    get_avatar_related_supported_avatars, get_filtered_asset_ids, get_sorted_assets_for_display,
    get_world_categories, open_in_file_manager, request_asset_deletion,
    request_avatar_asset_import, request_avatar_related_asset_import, request_world_asset_import,
    update_avatar_asset, update_avatar_related_asset, update_world_asset,
};
use updater::update_handler::UpdateHandler;

mod booth;
mod commands;
mod data_store;
mod definitions;
mod importer;
mod updater;

const VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(generate_handler())
        .setup(|app| {
            let basic_store = init(&app);
            app.manage(basic_store);

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

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init(handler: &App) -> StoreProvider {
    handler
        .get_webview_window("main")
        .unwrap()
        .set_title(&format!("KonoAsset v{}", VERSION))
        .unwrap();

    let result = delete_temporary_images(&handler.path().app_local_data_dir().unwrap());
    if result.is_err() {
        eprintln!("Failed to delete temporary images: {}", result.unwrap_err());
    }

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
        // アセット取得
        get_asset,
        get_sorted_assets_for_display,
        // アセット作成リクエスト
        request_avatar_asset_import,
        request_avatar_related_asset_import,
        request_world_asset_import,
        // アセット削除
        request_asset_deletion,
        // アセット更新
        update_avatar_asset,
        update_avatar_related_asset,
        update_world_asset,
        // フィールドごとの全情報取得系
        get_all_asset_tags,
        get_all_supported_avatar_values,
        get_avatar_related_categories,
        get_avatar_related_supported_avatars,
        get_world_categories,
        // 画像新規作成
        copy_image_file_to_images,
        // ファイルマネージャで開く
        open_in_file_manager,
        // Boothからアセット情報を取得する
        get_asset_description_from_booth,
        // 検索関数
        get_filtered_asset_ids,
        // アップデート関連
        check_for_update,
        execute_update,
        do_not_notify_update,
    ]
}
