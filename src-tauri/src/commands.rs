use tauri::State;

use crate::{
    data_store::provider::StoreProvider,
    definitions::{
        entities::{AvatarAsset, AvatarRelatedAsset, WorldAsset},
        pre::PreAvatarAsset,
    },
};

#[tauri::command]
pub fn get_avatar_assets(basic_store: State<'_, StoreProvider>) -> Vec<AvatarAsset> {
    basic_store
        .get_avatar_store()
        .get_assets()
        .iter()
        .cloned()
        .collect()
}

#[tauri::command]
pub fn get_avatar_related_assets(basic_store: State<'_, StoreProvider>) -> Vec<AvatarRelatedAsset> {
    basic_store
        .get_avatar_related_store()
        .get_assets()
        .iter()
        .cloned()
        .collect()
}

#[tauri::command]
pub fn get_world_assets(basic_store: State<'_, StoreProvider>) -> Vec<WorldAsset> {
    basic_store
        .get_world_store()
        .get_assets()
        .iter()
        .cloned()
        .collect()
}

#[tauri::command]
pub fn create_avatar_asset(
    basic_store: State<'_, StoreProvider>,
    pre_avatar_asset: PreAvatarAsset,
) -> AvatarAsset {
    let asset = AvatarAsset::create(pre_avatar_asset.description);
    basic_store
        .get_avatar_store()
        .add_asset_and_save(asset.clone());

    asset
}
