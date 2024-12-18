use data_store::provider::StoreProvider;
use tauri::{App, Manager};

use commands::{
    copy_image_file_to_images, get_all_asset_tags, get_all_supported_avatar_values, get_asset,
    get_asset_description_from_booth, get_avatar_assets, get_avatar_related_assets,
    get_avatar_related_categories, get_avatar_related_supported_avatars, get_filtered_asset_ids,
    get_world_assets, open_in_file_manager, request_asset_deletion, request_avatar_asset_import,
    request_avatar_related_asset_import, request_world_asset_import, update_avatar_asset,
    update_avatar_related_asset, update_world_asset,
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
        // アセット取得
        get_asset,
        get_avatar_assets,
        get_avatar_related_assets,
        get_world_assets,
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
        // 画像新規作成
        copy_image_file_to_images,
        // ファイルマネージャで開く
        open_in_file_manager,
        // Boothからアセット情報を取得する
        get_asset_description_from_booth,
        // 検索関数
        get_filtered_asset_ids
    ]
}
