use crate::definitions::{entities::AssetItem, pre::PreAssetItem};

pub fn create_asset(pre_asset_item: PreAssetItem) -> AssetItem {
    AssetItem::create(
        pre_asset_item.title,
        pre_asset_item.author,
        pre_asset_item.types,
        pre_asset_item.image_src,
        pre_asset_item.category,
        pre_asset_item.asset_dirs,
        pre_asset_item.tags,
    )
}
