use std::collections::HashMap;
use std::path::Path;
use std::sync::Arc;

use async_zip::base::write::ZipFileWriter;
use async_zip::{Compression, ZipEntryBuilder};
use tokio::fs::File;
use tokio::sync::Mutex;

use crate::data_store::provider::StoreProvider;
use crate::definitions::traits::AssetTrait;

pub async fn export_as_human_readable_structured_zip<P>(
    store_provider: Arc<Mutex<StoreProvider>>,
    path: P,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    let mut file = File::create(path.as_ref())
        .await
        .map_err(|e| e.to_string())?;
    let mut writer = ZipFileWriter::with_tokio(&mut file);

    let (data_dir, avatars, avatar_wearables, world_objects) = {
        let store_provider = store_provider.lock().await;

        let data_dir = store_provider.data_dir().join("data");

        let avatars = store_provider.get_avatar_store().get_all().await;
        let avatar_wearables = store_provider.get_avatar_wearable_store().get_all().await;
        let world_objects = store_provider.get_world_object_store().get_all().await;

        (data_dir, avatars, avatar_wearables, world_objects)
    };

    let avatar_wearables_by_category =
        avatar_wearables
            .into_iter()
            .fold(HashMap::new(), |mut map, item| {
                map.entry(sanitize_filename::sanitize(&item.category))
                    .or_insert_with(Vec::new)
                    .push(item);
                map
            });

    let world_objects_by_category =
        world_objects
            .into_iter()
            .fold(HashMap::new(), |mut map, item| {
                map.entry(sanitize_filename::sanitize(&item.category))
                    .or_insert_with(Vec::new)
                    .push(item);
                map
            });

    new_zip_dir(&mut writer, "Avatars/").await?;

    for avatar in avatars {
        let item_path = format!(
            "Avatars/{}/",
            sanitize_filename::sanitize(&avatar.description.name)
        );

        new_zip_dir(&mut writer, &item_path).await?;

        if let Some(booth_id) = avatar.description.booth_item_id {
            writer
                .write_entry_whole(
                    ZipEntryBuilder::new(
                        format!("{}Booth.url", item_path).into(),
                        Compression::Stored,
                    ),
                    &create_link_file_data(booth_id),
                )
                .await
                .map_err(|e| e.to_string())?;
        }

        let asset_data_path = data_dir.join(avatar.id.to_string());

        write_asset_data(&mut writer, item_path, asset_data_path).await?;
    }

    new_zip_dir(&mut writer, "AvatarWearables/").await?;
    for key in avatar_wearables_by_category.keys() {
        let category = if !key.is_empty() {
            key
        } else {
            "Uncategorized"
        };

        write_categorized_assets(
            &mut writer,
            category,
            avatar_wearables_by_category.get(key).unwrap(),
            &data_dir,
            "AvatarWearables/",
        )
        .await?;
    }

    new_zip_dir(&mut writer, "WorldObjects/").await?;
    for key in world_objects_by_category.keys() {
        let category = if !key.is_empty() {
            key
        } else {
            "Uncategorized"
        };

        write_categorized_assets(
            &mut writer,
            category,
            world_objects_by_category.get(key).unwrap(),
            &data_dir,
            "WorldObjects/",
        )
        .await?;
    }

    writer.close().await.map_err(|e| e.to_string())?;

    Ok(())
}

async fn write_categorized_assets<A>(
    writer: &mut async_zip::tokio::write::ZipFileWriter<&mut File>,
    category: &str,
    assets: &Vec<A>,
    data_dir: &Path,
    zip_prefix: &str,
) -> Result<(), String>
where
    A: AssetTrait,
{
    let item_path = format!("{}{}/", zip_prefix, category);

    new_zip_dir(writer, &item_path).await?;

    for item in assets {
        let item_path = format!(
            "{}{}/",
            item_path,
            sanitize_filename::sanitize(&item.get_description().name)
        );

        new_zip_dir(writer, &item_path).await?;

        if let Some(booth_id) = item.get_description().booth_item_id {
            writer
                .write_entry_whole(
                    ZipEntryBuilder::new(
                        format!("{}Booth.url", item_path).into(),
                        Compression::Stored,
                    ),
                    &create_link_file_data(booth_id),
                )
                .await
                .map_err(|e| e.to_string())?;
        }

        let asset_data_path = data_dir.join(item.get_id().to_string());

        write_asset_data(writer, item_path, asset_data_path).await?;
    }

    Ok(())
}

async fn write_asset_data<P>(
    writer: &mut async_zip::tokio::write::ZipFileWriter<&mut File>,
    zip_relative_path: String,
    path: P,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    let path = path.as_ref();

    let mut read_dir = tokio::fs::read_dir(path).await.map_err(|e| e.to_string())?;

    while let Some(entry) = read_dir.next_entry().await.map_err(|e| e.to_string())? {
        let entry_path = entry.path();

        if entry_path.is_dir() {
            let file_name = entry_path.file_name().unwrap().to_str().unwrap();
            let new_relative_path = format!("{}{}/", zip_relative_path, file_name);

            new_zip_dir(writer, &new_relative_path).await?;

            Box::pin(write_asset_data(writer, new_relative_path, entry_path)).await?;
        } else {
            let relative_path = entry_path.strip_prefix(path).map_err(|e| e.to_string())?;
            let zip_path = format!("{}{}", zip_relative_path, relative_path.to_string_lossy());

            let data = tokio::fs::read(entry_path)
                .await
                .map_err(|e| e.to_string())?;
            let builder = ZipEntryBuilder::new(zip_path.into(), Compression::Stored);

            writer
                .write_entry_whole(builder, &data)
                .await
                .map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}

async fn new_zip_dir(
    writer: &mut async_zip::tokio::write::ZipFileWriter<&mut File>,
    dir_name: &str,
) -> Result<(), String> {
    writer
        .write_entry_whole(
            ZipEntryBuilder::new(dir_name.into(), Compression::Stored),
            b"",
        )
        .await
        .map_err(|e| e.to_string())
}

fn create_link_file_data(booth_id: u64) -> Vec<u8> {
    let base = "[{000214A0-0000-0000-C000-000000000046}]
Prop3=19,11
[InternetShortcut]
IDList=
URL=";

    let mut data = base.as_bytes().to_vec();
    data.extend_from_slice(format!("https://booth.pm/ja/items/{}/\n", booth_id).as_bytes());

    data
}
