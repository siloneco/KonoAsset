use std::{collections::HashMap, sync::Arc};

use tokio::sync::Mutex;

use crate::{
    data_store::provider::StoreProvider,
    definitions::entities::{Avatar, AvatarWearable, WorldObject},
};

use super::definitions::{AssetExportOverview, CategoryBasedAssets};

pub async fn get_category_based_assets(
    store_provider: Arc<Mutex<StoreProvider>>,
) -> CategoryBasedAssets {
    let (data_dir, avatars, avatar_wearables, world_objects) = {
        let store_provider = store_provider.lock().await;

        let data_dir = store_provider.data_dir();

        let avatars = store_provider.get_avatar_store().get_all().await;
        let avatar_wearables = store_provider.get_avatar_wearable_store().get_all().await;
        let world_objects = store_provider.get_world_object_store().get_all().await;

        (data_dir, avatars, avatar_wearables, world_objects)
    };

    let avatars = avatars
        .into_iter()
        .map(|avatar| AssetExportOverview::<Avatar>::new(avatar, &data_dir))
        .collect();

    let avatar_wearables_by_category =
        avatar_wearables
            .into_iter()
            .fold(HashMap::new(), |mut map, item| {
                map.entry(sanitize_filename::sanitize(&item.category))
                    .or_insert_with(Vec::new)
                    .push(AssetExportOverview::<AvatarWearable>::new(item, &data_dir));
                map
            });

    let world_objects_by_category =
        world_objects
            .into_iter()
            .fold(HashMap::new(), |mut map, item| {
                map.entry(sanitize_filename::sanitize(&item.category))
                    .or_insert_with(Vec::new)
                    .push(AssetExportOverview::<WorldObject>::new(item, &data_dir));
                map
            });

    CategoryBasedAssets::new(
        avatars,
        avatar_wearables_by_category,
        world_objects_by_category,
    )
}
