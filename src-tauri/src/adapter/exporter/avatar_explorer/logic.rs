use std::{
    path::{Path, PathBuf, MAIN_SEPARATOR_STR},
    sync::Arc,
};

use tauri::AppHandle;
use tauri_specta::Event;
use tokio::{
    fs::{read_dir, File},
    io::AsyncWriteExt,
    sync::Mutex,
};

use crate::{
    adapter::exporter::util::get_category_based_assets,
    data_store::provider::StoreProvider,
    definitions::entities::ProgressEvent,
    file::{
        cleanup::DeleteOnDrop,
        modify_guard::{self, FileTransferGuard},
    },
};

use super::builder::AvatarExplorerItemBuilder;

pub async fn export_as_avatar_explorer_compatible_structure<P>(
    store_provider: Arc<Mutex<StoreProvider>>,
    path: P,
    app: &AppHandle,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    let path = path.as_ref();

    if path.exists() {
        if !path.is_dir() {
            return Err(format!("Path is not a directory: {}", path.display()));
        }

        // Check if the directory is empty
        let mut read_dir = read_dir(path).await.map_err(|e| e.to_string())?;
        if read_dir
            .next_entry()
            .await
            .map_err(|e| e.to_string())?
            .is_some()
        {
            return Err(format!("Directory is not empty: {}", path.display()));
        }
    } else {
        tokio::fs::create_dir_all(path)
            .await
            .map_err(|e| format!("Failed to create directory ({}): {}", path.display(), e))?;
    }

    let mut cleanup = DeleteOnDrop::new(path.to_path_buf());

    let mut avatar_explorer_items = Vec::new();

    let items_dir = path.join("Items");
    let thumbnail_dir = path.join("Thumbnail");
    let items_data_json_path = path.join("ItemsData.json");
    let custom_category_txt_path = path.join("CustomCategory.txt");
    let common_avatar_json_path = path.join("CommonAvatar.json");

    tokio::fs::create_dir(&items_dir).await.map_err(|e| {
        format!(
            "Failed to create directory ({}): {}",
            items_dir.display(),
            e
        )
    })?;
    tokio::fs::create_dir(&thumbnail_dir).await.map_err(|e| {
        format!(
            "Failed to create directory ({}): {}",
            thumbnail_dir.display(),
            e
        )
    })?;

    let category_based_assets = get_category_based_assets(store_provider.clone()).await;

    let avatars = category_based_assets.avatars;
    let avatar_wearables = category_based_assets.avatar_wearables;
    let world_objects = category_based_assets.world_objects;

    let total_assets = avatars.len()
        + avatar_wearables.values().flatten().count()
        + world_objects.values().flatten().count();

    let mut processed_assets: usize = 0;

    for avatar in avatars {
        let name = &avatar.asset.description.name;
        let booth_id = avatar.asset.description.booth_item_id;
        let image_file_path = avatar.image_path.as_ref();
        let sanitized_name = sanitize_filename::sanitize(name);

        let dest = unique_destination(&items_dir, &sanitized_name);

        modify_guard::copy_dir(
            avatar.data_dir.clone(),
            dest.clone(),
            false,
            FileTransferGuard::dest(path),
            |progress, filename| {
                let percentage =
                    ((processed_assets as f32 + progress) / (total_assets as f32)) * 100f32;
                let result =
                    ProgressEvent::new(percentage, format!("{}: {}", name, filename)).emit(app);

                if let Err(e) = result {
                    log::error!("Failed to emit progress event: {:?}", e);
                }
            },
        )
        .await
        .map_err(|e| {
            format!(
                "Failed to copy asset data directory ({}): {}",
                avatar.data_dir.display(),
                e
            )
        })?;

        if booth_id.is_some() && image_file_path.is_some() {
            let booth_id = booth_id.unwrap();
            let image_file_path = image_file_path.unwrap();

            if image_file_path.exists() {
                modify_guard::copy_file(
                    image_file_path,
                    &thumbnail_dir.join(format!("{}.png", booth_id)),
                    false,
                    FileTransferGuard::dest(path),
                )
                .await
                .map_err(|e| format!("Failed to copy asset image file: {}", e))?;
            }
        }

        let relative_item_path = dest
            .strip_prefix(path)
            .map_err(|e| e.to_string())?
            .to_string_lossy()
            .to_string();

        let builder: AvatarExplorerItemBuilder = avatar.asset.into();
        let item = builder
            .set_relative_item_path(format!("Datas{}{}", MAIN_SEPARATOR_STR, relative_item_path))
            .build()?;

        avatar_explorer_items.push(item);
        processed_assets += 1;
    }

    for item in avatar_wearables.into_values().flatten() {
        let name = &item.asset.description.name;
        let booth_id = item.asset.description.booth_item_id;
        let image_file_path = item.image_path.as_ref();
        let sanitized_name = sanitize_filename::sanitize(name);

        let dest = unique_destination(&items_dir, &sanitized_name);

        modify_guard::copy_dir(
            item.data_dir.clone(),
            dest.clone(),
            false,
            FileTransferGuard::dest(path),
            |progress, filename| {
                let percentage =
                    ((processed_assets as f32 + progress) / (total_assets as f32)) * 100f32;
                let result =
                    ProgressEvent::new(percentage, format!("{}: {}", name, filename)).emit(app);

                if let Err(e) = result {
                    log::error!("Failed to emit progress event: {:?}", e);
                }
            },
        )
        .await
        .map_err(|e| {
            format!(
                "Failed to copy asset data directory ({}): {}",
                item.data_dir.display(),
                e
            )
        })?;

        if booth_id.is_some() && image_file_path.is_some() {
            let booth_id = booth_id.unwrap();
            let image_file_path = image_file_path.unwrap();

            if image_file_path.exists() {
                modify_guard::copy_file(
                    image_file_path,
                    &thumbnail_dir.join(format!("{}.png", booth_id)),
                    false,
                    FileTransferGuard::dest(path),
                )
                .await
                .map_err(|e| {
                    format!(
                        "Failed to copy asset image file ({}): {}",
                        image_file_path.display(),
                        e
                    )
                })?;
            }
        }

        let relative_item_path = dest
            .strip_prefix(path)
            .map_err(|e| e.to_string())?
            .to_string_lossy()
            .to_string();

        let builder: AvatarExplorerItemBuilder = item.asset.into();
        let item = builder
            .set_relative_item_path(format!("Datas{}{}", MAIN_SEPARATOR_STR, relative_item_path))
            .build()?;

        avatar_explorer_items.push(item);
        processed_assets += 1;
    }

    for item in world_objects.into_values().flatten() {
        let name = &item.asset.description.name;
        let booth_id = item.asset.description.booth_item_id;
        let image_file_path = item.image_path.as_ref();
        let sanitized_name = sanitize_filename::sanitize(name);

        let dest = unique_destination(&items_dir, &sanitized_name);

        modify_guard::copy_dir(
            item.data_dir.clone(),
            dest.clone(),
            false,
            FileTransferGuard::dest(path),
            |progress, filename| {
                let percentage =
                    ((processed_assets as f32 + progress) / (total_assets as f32)) * 100f32;
                let result =
                    ProgressEvent::new(percentage, format!("{}: {}", name, filename)).emit(app);

                if let Err(e) = result {
                    log::error!("Failed to emit progress event: {:?}", e);
                }
            },
        )
        .await
        .map_err(|e| {
            format!(
                "Failed to copy asset data directory ({}): {}",
                item.data_dir.display(),
                e
            )
        })?;

        if booth_id.is_some() && image_file_path.is_some() {
            let booth_id = booth_id.unwrap();
            let image_file_path = image_file_path.unwrap();

            modify_guard::copy_file(
                image_file_path,
                &thumbnail_dir.join(format!("{}.png", booth_id)),
                false,
                FileTransferGuard::dest(path),
            )
            .await
            .map_err(|e| {
                format!(
                    "Failed to copy asset image file ({}): {}",
                    image_file_path.display(),
                    e
                )
            })?;
        }

        let relative_item_path = dest
            .strip_prefix(path)
            .map_err(|e| e.to_string())?
            .to_string_lossy()
            .to_string();

        let builder: AvatarExplorerItemBuilder = item.asset.into();
        let item = builder
            .set_relative_item_path(format!("Datas{}{}", MAIN_SEPARATOR_STR, relative_item_path))
            .build()?;

        avatar_explorer_items.push(item);
        processed_assets += 1;
    }

    let custom_categories =
        avatar_explorer_items
            .iter()
            .fold(std::collections::HashSet::new(), |mut set, item| {
                if !item.custom_category.is_empty() {
                    set.insert(item.custom_category.clone());
                }
                set
            });
    let mut custom_categories = custom_categories.into_iter().collect::<Vec<_>>();
    custom_categories.sort_by(|a, b| {
        let is_a_world = a.starts_with("World:");
        let is_b_world = b.starts_with("World:");

        if is_a_world && !is_b_world {
            return std::cmp::Ordering::Greater;
        } else if !is_a_world && is_b_world {
            return std::cmp::Ordering::Less;
        }

        a.cmp(b)
    });
    let custom_categories = custom_categories.join("\n");

    let file = File::create(&custom_category_txt_path).await.map_err(|e| {
        format!(
            "Failed to create custom category file ({}): {}",
            custom_category_txt_path.display(),
            e
        )
    })?;
    let mut writer = tokio::io::BufWriter::new(file);

    writer
        .write_all(custom_categories.as_bytes())
        .await
        .map_err(|e| {
            format!(
                "Failed to write custom category file ({}): {}",
                custom_category_txt_path.display(),
                e
            )
        })?;
    writer.flush().await.map_err(|e| e.to_string())?;

    let file = std::fs::File::create(&items_data_json_path).map_err(|e| {
        format!(
            "Failed to create items data JSON file ({}): {}",
            items_data_json_path.display(),
            e
        )
    })?;
    serde_json::to_writer(file, &avatar_explorer_items).map_err(|e| {
        format!(
            "Failed to write items data JSON file ({}): {}",
            items_data_json_path.display(),
            e
        )
    })?;

    let file = File::create(&common_avatar_json_path).await.map_err(|e| {
        format!(
            "Failed to create common avatar JSON file ({}): {}",
            common_avatar_json_path.display(),
            e
        )
    })?;
    let mut writer = tokio::io::BufWriter::new(file);

    writer.write_all(b"[]").await.map_err(|e| {
        format!(
            "Failed to write common avatar JSON file ({}): {}",
            common_avatar_json_path.display(),
            e
        )
    })?;
    writer.flush().await.map_err(|e| e.to_string())?;

    cleanup.mark_as_completed();

    Ok(())
}

fn unique_destination<P, S>(parent: P, preferred_name: S) -> PathBuf
where
    P: AsRef<Path>,
    S: AsRef<str>,
{
    let preferred = parent.as_ref().join(preferred_name.as_ref());
    if !preferred.exists() {
        return preferred;
    }

    let mut i = 1;
    loop {
        let candidate = parent
            .as_ref()
            .join(format!("{} ({})", preferred_name.as_ref(), i));

        if !candidate.exists() {
            return candidate;
        }

        i += 1;
    }
}
