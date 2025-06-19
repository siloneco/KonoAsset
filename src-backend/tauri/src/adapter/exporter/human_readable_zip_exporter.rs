use std::path::Path;
use std::sync::Arc;

use async_zip::base::write::ZipFileWriter;
use async_zip::{Compression, ZipEntryBuilder};
use file::DeleteOnDrop;
use model::AssetTrait;
use tauri::AppHandle;
use tauri_specta::Event;
use tokio::fs::File;
use tokio::sync::Mutex;

use crate::data_store::provider::StoreProvider;
use crate::definitions::entities::ProgressEvent;

use super::definitions::AssetExportOverview;
use super::util::{get_category_based_assets, new_zip_dir};

pub async fn export_as_human_readable_structured_zip<P>(
    store_provider: Arc<Mutex<StoreProvider>>,
    path: P,
    app: Option<&AppHandle>,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    let mut cleanup = DeleteOnDrop::new(path.as_ref().to_path_buf());

    let mut file = File::create(path.as_ref())
        .await
        .map_err(|e| e.to_string())?;
    let mut writer = ZipFileWriter::with_tokio(&mut file);

    let category_based_assets = get_category_based_assets(store_provider.clone()).await;

    let avatars = category_based_assets.avatars;
    let avatar_wearables = category_based_assets.avatar_wearables;
    let world_objects = category_based_assets.world_objects;
    let other_assets = category_based_assets.other_assets;

    let total_assets = avatars.len()
        + avatar_wearables.values().flatten().count()
        + world_objects.values().flatten().count()
        + other_assets.values().flatten().count();

    let mut processed_assets: usize = 0;

    new_zip_dir(&mut writer, "Avatars/").await?;

    for avatar in avatars {
        let name = avatar.asset.description.name;
        let booth_id = avatar.asset.description.booth_item_id;

        if let Some(app) = app {
            let percentage = ((processed_assets as f32) / (total_assets as f32)) * 100f32;
            if let Err(e) = ProgressEvent::new(percentage, name.clone()).emit(app) {
                log::error!("Failed to emit progress event: {:?}", e);
            }
        }

        let item_path = format!("Avatars/{}/", sanitize_filename::sanitize(&name));

        new_zip_dir(&mut writer, &item_path).await?;

        if let Some(booth_id) = booth_id {
            writer
                .write_entry_whole(
                    ZipEntryBuilder::new(
                        format!("{}BOOTH.url", item_path).into(),
                        Compression::Stored,
                    ),
                    &create_link_file_data(booth_id),
                )
                .await
                .map_err(|e| e.to_string())?;
        }

        write_asset_data(&mut writer, item_path, avatar.data_dir).await?;

        processed_assets += 1;
    }

    new_zip_dir(&mut writer, "AvatarWearables/").await?;
    for key in avatar_wearables.keys() {
        let category = if !key.is_empty() {
            key
        } else {
            "Uncategorized"
        };

        write_categorized_assets(
            &mut writer,
            category,
            avatar_wearables.get(key).unwrap(),
            "AvatarWearables/",
            |name| {
                if app.is_none() {
                    return;
                }
                let app = app.unwrap();

                let percentage = ((processed_assets as f32) / (total_assets as f32)) * 100f32;
                if let Err(e) = ProgressEvent::new(percentage, name).emit(app) {
                    log::error!("Failed to emit progress event: {:?}", e);
                }

                processed_assets += 1;
            },
        )
        .await?;
    }

    new_zip_dir(&mut writer, "WorldObjects/").await?;
    for key in world_objects.keys() {
        let category = if !key.is_empty() {
            key
        } else {
            "Uncategorized"
        };

        write_categorized_assets(
            &mut writer,
            category,
            world_objects.get(key).unwrap(),
            "WorldObjects/",
            |name| {
                if app.is_none() {
                    return;
                }
                let app = app.unwrap();

                let percentage = ((processed_assets as f32) / (total_assets as f32)) * 100f32;
                if let Err(e) = ProgressEvent::new(percentage, name).emit(app) {
                    log::error!("Failed to emit progress event: {:?}", e);
                }

                processed_assets += 1;
            },
        )
        .await?;
    }

    new_zip_dir(&mut writer, "OtherAssets/").await?;
    for key in other_assets.keys() {
        let category = if !key.is_empty() {
            key
        } else {
            "Uncategorized"
        };

        write_categorized_assets(
            &mut writer,
            category,
            other_assets.get(key).unwrap(),
            "OtherAssets/",
            |name| {
                if app.is_none() {
                    return;
                }
                let app = app.unwrap();

                let percentage = ((processed_assets as f32) / (total_assets as f32)) * 100f32;
                if let Err(e) = ProgressEvent::new(percentage, name).emit(app) {
                    log::error!("Failed to emit progress event: {:?}", e);
                }

                processed_assets += 1;
            },
        )
        .await?;
    }

    writer.close().await.map_err(|e| e.to_string())?;

    cleanup.mark_as_completed();

    Ok(())
}

async fn write_categorized_assets<A>(
    writer: &mut async_zip::tokio::write::ZipFileWriter<&mut File>,
    category: &str,
    assets: &Vec<AssetExportOverview<A>>,
    zip_prefix: &str,
    mut callback: impl FnMut(String),
) -> Result<(), String>
where
    A: AssetTrait,
{
    let item_path = format!("{}{}/", zip_prefix, category);

    new_zip_dir(writer, &item_path).await?;

    for item in assets {
        let name = item.asset.get_description().name.clone();
        let booth_id = item.asset.get_description().booth_item_id;

        callback(name.clone());

        let item_path = format!("{}{}/", item_path, sanitize_filename::sanitize(&name));

        new_zip_dir(writer, &item_path).await?;

        if let Some(booth_id) = booth_id {
            writer
                .write_entry_whole(
                    ZipEntryBuilder::new(
                        format!("{}BOOTH.url", item_path).into(),
                        Compression::Stored,
                    ),
                    &create_link_file_data(booth_id),
                )
                .await
                .map_err(|e| e.to_string())?;
        }

        write_asset_data(writer, item_path, &item.data_dir).await?;
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

            // Box::pin is required to make the recursive call work
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

#[cfg(test)]
mod tests {
    use file::modify_guard::{self, FileTransferGuard};

    use super::*;

    const BOOTH_SHORTCUT_FILENAME: &str = "BOOTH.url";

    #[tokio::test]
    async fn test_human_readable_export_fn() {
        let dest = "test/temp/export/human_readable";
        let zip = format!("{dest}/exported.zip");
        let extracted = format!("{dest}/extracted");
        let provider = format!("{dest}/provider");

        if std::fs::exists(dest).unwrap() {
            std::fs::remove_dir_all(dest).unwrap();
        }
        std::fs::create_dir_all(&extracted).unwrap();

        modify_guard::copy_dir(
            "test/example_root_dir/sample1",
            provider.clone(),
            false,
            FileTransferGuard::none(),
            |_, _| {},
        )
        .await
        .unwrap();

        let mut provider = StoreProvider::create(&provider).unwrap();
        provider.load_all_assets_from_files().await.unwrap();

        let provider = Arc::new(Mutex::new(provider));

        export_as_human_readable_structured_zip(provider, &zip, None)
            .await
            .unwrap();

        assert!(std::fs::exists(&zip).unwrap());

        zip::extract_zip(&zip, &extracted, |_, _| {}).await.unwrap();

        assert_eq!(std::fs::read_dir(&extracted).unwrap().count(), 4);

        let avatar = format!("{extracted}/Avatars/Test Avatar");
        let avatar_wearable =
            format!("{extracted}/AvatarWearables/TestAvatarWearableCategory/Test Avatar Wearable");
        let world_object =
            format!("{extracted}/WorldObjects/TestWorldObjectCategory/Test World Object");
        let other_asset =
            format!("{extracted}/OtherAssets/TestOtherAssetCategory/Test Other Asset");

        assert!(std::fs::exists(format!("{avatar}/{BOOTH_SHORTCUT_FILENAME}")).unwrap());
        assert!(std::fs::exists(format!("{avatar_wearable}/{BOOTH_SHORTCUT_FILENAME}")).unwrap());
        assert!(std::fs::exists(format!("{world_object}/{BOOTH_SHORTCUT_FILENAME}")).unwrap());
        assert!(std::fs::exists(format!("{other_asset}/{BOOTH_SHORTCUT_FILENAME}")).unwrap());

        assert!(std::fs::exists(format!("{avatar}/dummy.txt")).unwrap());
        assert!(std::fs::exists(format!("{avatar_wearable}/dummy.txt")).unwrap());
        assert!(std::fs::exists(format!("{world_object}/dummy.txt")).unwrap());
        assert!(std::fs::exists(format!("{other_asset}/dummy.txt")).unwrap());

        assert_eq!(
            std::fs::read_to_string(format!("{avatar}/{BOOTH_SHORTCUT_FILENAME}"))
                .unwrap()
                .trim(),
            r#"
[{000214A0-0000-0000-C000-000000000046}]
Prop3=19,11
[InternetShortcut]
IDList=
URL=https://booth.pm/ja/items/6641548/
"#
            .trim()
        );
    }
}
