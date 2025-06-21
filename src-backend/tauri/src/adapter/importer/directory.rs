use std::{collections::HashMap, path::Path};

use data_store::provider::StoreProvider;
use file::{
    DeleteOnDrop,
    modify_guard::{self, FileTransferGuard},
};
use model::{AssetTrait, Avatar, AvatarWearable, OtherAsset, WorldObject};
use tauri::AppHandle;
use tauri_specta::Event;
use uuid::Uuid;

use crate::definitions::entities::ProgressEvent;

pub async fn import_data_store_from_directory<P>(
    data_store_provider: &mut StoreProvider,
    path: P,
    app_handle: Option<AppHandle>,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    let progress_callback = move |progress, filename| {
        let app_handle = app_handle.clone();

        if app_handle.is_none() {
            // app_handle will only be None when running in a test environment
            return;
        }
        let app = app_handle.unwrap();

        let emit_result = ProgressEvent::new(progress * 100f32, filename).emit(&app);

        if let Err(e) = emit_result {
            log::error!("Failed to emit progress event: {}", e);
        }
    };

    internal_import_data_store_from_directory(data_store_provider, path, progress_callback).await
}

pub async fn internal_import_data_store_from_directory<P>(
    data_store_provider: &mut StoreProvider,
    path: P,
    progress_callback: impl Fn(f32, String) + Send + Sync + 'static,
) -> Result<(), String>
where
    P: AsRef<Path>,
{
    let path = path.as_ref();

    if !path.is_dir() {
        return Err(format!(
            "Invalid path. Expected a directory: {}",
            path.display()
        ));
    }

    let external_data_store_provider = read_dir_as_data_store_provider(path).await?;

    let currently_used_ids = data_store_provider.get_used_ids().await;
    let external_ids = external_data_store_provider.get_used_ids().await;

    let conflicted_ids = currently_used_ids
        .intersection(&external_ids)
        .cloned()
        .collect::<Vec<_>>();

    let reassign_map = conflicted_ids
        .iter()
        .map(|id| (*id, Uuid::new_v4()))
        .collect::<HashMap<_, _>>();

    let data_dir = data_store_provider.data_dir().join("data");
    let external_data_dir = path.join("data");

    let mut cleanups = Vec::new();
    let mut count: usize = 0;
    let total = external_ids.len();

    for id in external_ids {
        let from = external_data_dir.join(id.to_string());
        let to = data_dir.join(reassign_map.get(&id).unwrap_or(&id).to_string());

        let from_path = from.display().to_string();
        let to_path = to.display().to_string();

        cleanups.push(DeleteOnDrop::new(to.clone()));

        let callback = |progress, filename| {
            let progress = ((count as f32 + progress) / total as f32) * 0.9f32;
            progress_callback(progress, filename);
        };

        modify_guard::copy_dir(
            from,
            to,
            false,
            FileTransferGuard::both(&external_data_dir, &data_dir),
            callback,
        )
        .await
        .map_err(|e| {
            format!(
                "Failed to merge data directory: Failed to copy {} to {}: {}",
                from_path, to_path, e
            )
        })?;

        count += 1;
    }

    let images_dir = data_store_provider.data_dir().join("images");
    let external_images_dir = path.join("images");

    if external_images_dir.exists() {
        modify_guard::copy_dir(
            external_images_dir,
            images_dir,
            false,
            FileTransferGuard::none(),
            |progress, filename| {
                let progress = 0.9f32 + progress * 0.1f32;
                progress_callback(progress, filename);
            },
        )
        .await
        .map_err(|e| format!("Failed to merge images directory: {}", e))?;
    }

    data_store_provider
        .merge_from(&external_data_store_provider, &reassign_map)
        .await?;

    for mut cleanup in cleanups {
        cleanup.mark_as_completed();
    }

    Ok(())
}

pub async fn read_dir_as_data_store_provider<P>(path: P) -> Result<StoreProvider, String>
where
    P: AsRef<Path>,
{
    validate_data_store_directory(&path).await?;

    let path = path.as_ref();

    if !path.is_dir() {
        return Err(format!(
            "Invalid path. Expected a directory: {}",
            path.display()
        ));
    }

    let mut provider = StoreProvider::create(&path.to_path_buf())?;
    provider.load_all_assets_from_files().await?;

    Ok(provider)
}

pub async fn validate_data_store_directory<P>(path: P) -> Result<(), String>
where
    P: AsRef<Path>,
{
    let path = path.as_ref();

    if !path.is_dir() {
        return Err(format!(
            "Invalid path. Expected a directory: {}",
            path.display()
        ));
    }

    let metadata_dir = path.join("metadata");

    let avatar_file = metadata_dir.join(Avatar::filename());
    let avatar_wearable_file = metadata_dir.join(AvatarWearable::filename());
    let world_object_file = metadata_dir.join(WorldObject::filename());
    let other_asset_file = metadata_dir.join(OtherAsset::filename());

    if !avatar_file.exists()
        && !avatar_wearable_file.exists()
        && !world_object_file.exists()
        && !other_asset_file.exists()
    {
        return Err(format!(
            "Invalid data store directory. Missing metadata files: {}",
            metadata_dir.display()
        ));
    }

    let data_dir = path.join("data");

    if !data_dir.is_dir() {
        return Err(format!(
            "Invalid data store directory. Missing data directory: {}",
            data_dir.display()
        ));
    }

    return Ok(());
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_import_from_directory_fn() {
        // This test will import sample2 to sample1

        let root = "test/temp/import/directory";
        let src = "test/temp/import/directory/src";
        let dest = "test/temp/import/directory/dest";

        if std::fs::exists(root).unwrap() {
            std::fs::remove_dir_all(root).unwrap();
        }
        std::fs::create_dir_all(src).unwrap();
        std::fs::create_dir_all(dest).unwrap();

        modify_guard::copy_dir(
            "../test/example_root_dir/sample2",
            src,
            false,
            FileTransferGuard::none(),
            |_, _| {},
        )
        .await
        .unwrap();

        modify_guard::copy_dir(
            "../test/example_root_dir/sample1",
            dest,
            false,
            FileTransferGuard::none(),
            |_, _| {},
        )
        .await
        .unwrap();

        let mut provider = StoreProvider::create(dest).unwrap();
        provider.load_all_assets_from_files().await.unwrap();

        assert_eq!(provider.get_avatar_store().get_all().await.len(), 1);
        assert_eq!(
            provider.get_avatar_wearable_store().get_all().await.len(),
            1
        );
        assert_eq!(provider.get_world_object_store().get_all().await.len(), 1);
        assert_eq!(provider.get_other_asset_store().get_all().await.len(), 1);

        import_data_store_from_directory(&mut provider, src, None)
            .await
            .unwrap();

        assert_eq!(provider.get_avatar_store().get_all().await.len(), 2);
        assert_eq!(
            provider.get_avatar_wearable_store().get_all().await.len(),
            2
        );
        assert_eq!(provider.get_world_object_store().get_all().await.len(), 2);
        assert_eq!(provider.get_other_asset_store().get_all().await.len(), 2);
    }
}
