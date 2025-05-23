use tauri_specta::{collect_commands, Builder};

mod asset;
mod deep_link;
mod external;
mod file;
mod language;
mod preference;
mod suggest;
mod task;
mod update;

pub fn generate_tauri_specta_builder() -> Builder<tauri::Wry> {
    Builder::<tauri::Wry>::new().commands(collect_commands![
        // アセット関連
        asset::get::get_asset,
        asset::get::get_sorted_asset_summaries,
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
        asset::adapter::import_from_other_data_store,
        asset::adapter::export_as_konoasset_zip,
        asset::adapter::export_as_human_readable_zip,
        asset::adapter::export_for_avatar_explorer,
        asset::statistics::get_registration_statistics,
        asset::statistics::execute_volume_statistics_calculation_task,
        asset::statistics::get_volume_statistics_cache,
        // サジェストの取得関連
        suggest::get::get_all_asset_tags,
        suggest::get::get_all_supported_avatar_values,
        suggest::get::get_avatar_wearable_categories,
        suggest::get::get_avatar_wearable_supported_avatars,
        suggest::get::get_world_object_categories,
        // 外部API関連
        external::booth::get_asset_info_from_booth, // BOOTHからアセット情報を取得する
        external::booth::resolve_pximg_filename,
        external::booth::get_booth_url,
        // アップデート関連
        update::common::check_for_update,
        update::common::download_update,
        update::common::install_update,
        update::common::do_not_notify_update,
        update::changelog::get_changelog,
        // ファイル関連
        file::open::open_file_in_file_manager,
        file::open::open_app_dir,
        file::open::open_data_dir,
        file::open::open_metadata_dir,
        file::open::open_asset_data_dir,
        file::open::open_managed_dir,
        file::open::open_logs_dir,
        file::import::import_file_entries_to_asset, // 追加のファイル等をインポート
        file::import::copy_image_file_to_images,    // 画像新規作成
        file::list::list_asset_dir_entry,           // アセットのディレクトリの内容を取得
        file::delete::delete_entry_from_asset_data_dir, // アセットデータディレクトリからエントリを削除
        file::common::get_directory_path,               // 管理ディレクトリのパス取得
        file::common::list_unitypackage_files,          // unitypackage探索
        file::common::migrate_data_dir,                 // データフォルダ移行
        file::common::get_image_absolute_path,          // 画像の絶対パス取得
        file::common::extract_non_existent_paths,       // 存在しないパスを抽出
        // 設定関連
        preference::common::require_initial_setup,
        preference::common::get_preferences,
        preference::common::set_preferences,
        preference::reset::reset_application,
        preference::logging::get_logs,
        // タスク関連
        task::status::get_task_status,
        task::status::cancel_task_request,
        task::status::get_task_error,
        // 言語関係
        language::common::get_current_language_data,
        language::common::load_language_file,
        // DeepLink関係
        deep_link::execute::request_startup_deep_link_execution,
    ])
}
