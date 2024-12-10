use commands::{
    create_avatar_asset, get_avatar_assets, get_avatar_related_assets, get_world_assets,
};
use data_store::provider::StoreProvider;
use definitions::entities::{AssetDescription, AvatarAsset};
use tauri::{App, Manager};

mod commands;
mod data_store;
mod definitions;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_avatar_assets,
            get_avatar_related_assets,
            get_world_assets,
            create_avatar_asset,
        ])
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

    store.load_all_assets_from_files();

    // let asset = AvatarAsset::create(AssetDescription {
    //     title: "test".to_string(),
    //     author: "test".to_string(),
    //     image_src: "test".to_string(),
    //     asset_dirs: vec![],
    //     tags: vec!["test".to_string()],
    //     created_at: chrono::Local::now(),
    // });

    // store.get_avatar_store().add_asset_and_save(asset);

    store
}
