use tauri::State;
use uuid::Uuid;

use crate::{
    data_store::basic_store::BasicStore,
    definitions::{
        entities::{AssetItem, AssetType},
        pre::PreAssetItem,
    },
    factory,
};

#[tauri::command]
pub fn get_assets(basic_store: State<'_, BasicStore>, asset_type: AssetType) -> Vec<AssetItem> {
    basic_store.get_assets(asset_type)
}

#[tauri::command]
pub fn create_asset_and_save(basic_store: State<'_, BasicStore>, pre_asset_item: PreAssetItem) {
    println!("Create called");
    let asset = factory::create_asset(pre_asset_item);

    println!("Asset created");
    for asset_type in asset.types.clone() {
        println!("Saving as: {}", asset_type.display_name());
        basic_store.add_asset_and_save(asset_type, asset.clone());
    }
    println!("Done");
}

#[tauri::command]
pub fn delete_asset_and_save(
    basic_store: State<'_, BasicStore>,
    asset_type: AssetType,
    id: Uuid,
) -> bool {
    basic_store.delete_asset_and_save(asset_type, id)
}
