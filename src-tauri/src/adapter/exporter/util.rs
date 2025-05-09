use std::{collections::HashMap, sync::Arc};

use async_zip::{tokio::write::ZipFileWriter, Compression, ZipEntryBuilder};
use tokio::{fs::File, sync::Mutex};

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

pub async fn new_zip_dir<S>(
    writer: &mut ZipFileWriter<&mut File>,
    dir_name: S,
) -> Result<(), String>
where
    S: AsRef<str>,
{
    writer
        .write_entry_whole(
            ZipEntryBuilder::new(dir_name.as_ref().into(), Compression::Stored),
            b"",
        )
        .await
        .map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use crate::file::modify_guard::{self, FileTransferGuard};

    use super::*;

    #[tokio::test]
    async fn test_get_category_based_assets() {
        let provider = "test/temp/adapter/util";

        if std::fs::exists(provider).unwrap() {
            std::fs::remove_dir_all(provider).unwrap();
        }
        std::fs::create_dir_all(provider).unwrap();

        modify_guard::copy_dir(
            "test/example_root_dir/sample1",
            provider,
            false,
            FileTransferGuard::none(),
            |_, _| {},
        )
        .await
        .unwrap();

        let mut provider = StoreProvider::create(provider).unwrap();
        provider.load_all_assets_from_files().await.unwrap();

        let provider = Arc::new(Mutex::new(provider));

        let category_based_assets = get_category_based_assets(provider).await;

        let avatars = category_based_assets.avatars;
        let avatar_wearables = category_based_assets.avatar_wearables;
        let world_objects = category_based_assets.world_objects;

        assert_eq!(avatars.len(), 1);
        assert_eq!(avatar_wearables.len(), 1);
        assert_eq!(world_objects.len(), 1);

        assert_eq!(
            avatar_wearables
                .get("TestAvatarWearableCategory")
                .unwrap()
                .len(),
            1
        );
        assert_eq!(world_objects.get("TestCategory").unwrap().len(), 1);
    }
}
