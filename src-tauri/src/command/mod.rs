use tauri_specta::{collect_commands, Builder};

mod asset;
mod external;
mod file;
mod preference;
mod suggest;
mod task;
mod update;

pub fn generate_tauri_specta_builder() -> Builder<tauri::Wry> {
    Builder::<tauri::Wry>::new().commands(collect_commands![
        // アセット関連
        asset::get::get_asset,
        asset::get::get_sorted_assets_for_display,
        asset::get::get_asset_displays_by_booth_id,
        asset::create::request_avatar_import,
        asset::create::request_avatar_wearable_import,
        asset::create::request_world_object_import,
        asset::delete::request_asset_deletion,
        asset::update::update_avatar,
        asset::update::update_avatar_wearable,
        asset::update::update_world_object,
        asset::filter::get_filtered_asset_ids,
        asset::status::get_load_status,
        // サジェストの取得関連
        suggest::get::get_all_asset_tags,
        suggest::get::get_all_supported_avatar_values,
        suggest::get::get_avatar_wearable_categories,
        suggest::get::get_avatar_wearable_supported_avatars,
        suggest::get::get_world_object_categories,
        // 外部API関連
        external::booth::get_asset_info_from_booth, // Boothからアセット情報を取得する
        external::booth::resolve_pximg_filename,
        // アップデート関連
        update::common::check_for_update,
        update::common::execute_update,
        update::common::do_not_notify_update,
        // ファイル関連
        file::open::open_file_in_file_manager,
        file::open::open_app_dir,
        file::open::open_data_dir,
        file::open::open_metadata_dir,
        file::open::open_asset_data_dir,
        file::open::open_managed_dir,
        file::open::open_logs_dir,
        file::import::copy_image_file_to_images, // 画像新規作成
        file::common::get_directory_path,        // 管理ディレクトリのパス取得
        file::common::list_unitypackage_files,   // unitypackage探索
        file::common::migrate_data_dir,          // データフォルダ移行
        file::common::get_image_absolute_path,   // 画像の絶対パス取得
        // 設定関連
        preference::common::get_preferences,
        preference::common::set_preferences,
        preference::reset::reset_application,
        preference::logging::get_logs,
        // タスク関連
        task::status::get_task_status,
        task::status::cancel_task_request,
    ])
}
