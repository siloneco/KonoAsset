use std::{hash::Hash, path::PathBuf};

use file::modify_guard::{self, DeletionGuard};
use loader::HashSetVersionedLoader;
use model::AssetTrait;
use serde::{Serialize, de::DeserializeOwned};
use uuid::Uuid;

use super::{asset_storage::AssetStorage, json_asset_container::JsonAssetContainer};

pub async fn delete_asset(storage: &AssetStorage, id: Uuid) -> Result<(), String> {
    let app_dir = storage.data_dir();

    let deleted = delete_asset_from_store(&app_dir, &storage.get_avatar_store(), id).await?
        || delete_asset_from_store(&app_dir, &storage.get_avatar_wearable_store(), id).await?
        || delete_asset_from_store(&app_dir, &storage.get_world_object_store(), id).await?
        || delete_asset_from_store(&app_dir, &storage.get_other_asset_store(), id).await?;

    if !deleted {
        return Err("Asset not found".into());
    }

    // すべてのアセットの依存アセットからアイテムを削除
    storage.remove_all_dependencies(id).await?;

    return Ok(());
}

async fn delete_asset_from_store<
    T: AssetTrait + HashSetVersionedLoader<T> + Clone + Serialize + DeserializeOwned + Eq + Hash,
>(
    app_dir: &PathBuf,
    store: &JsonAssetContainer<T>,
    id: Uuid,
) -> Result<bool, String> {
    let asset = store.get_asset(id).await;
    if asset.is_none() {
        return Ok(false);
    }
    let asset = asset.unwrap();

    let result = store
        .delete_asset_and_save(id)
        .await
        .map_err(|e| format!("Failed to delete asset: {:?}", e))?;

    if !result {
        return Ok(false);
    }

    let path = app_dir.join("data").join(id.to_string());
    let dir_delete_result = modify_guard::delete_recursive(&path, &DeletionGuard::new(app_dir));

    if let Err(e) = dir_delete_result {
        return Err(format!("Failed to delete asset directory: {:?}", e));
    }

    let image = &asset.get_description().image_filename;

    if image.is_none() {
        return Ok(true);
    }
    let image_filename = image.as_ref().unwrap();

    // 画像削除をしてそのまま結果を返す
    delete_asset_image(app_dir, image_filename).await
}

pub async fn delete_asset_image(app_dir: &PathBuf, filename: &str) -> Result<bool, String> {
    let images_dir_path = app_dir.join("images");
    let image_path = images_dir_path.join(filename);

    log::info!("Image file path: {}", image_path.display());

    if !image_path.exists() {
        return Ok(true);
    }

    let image_delete_result =
        modify_guard::delete_single_file(&image_path, &DeletionGuard::new(&images_dir_path));

    if let Err(e) = image_delete_result {
        return Err(format!("Failed to delete image file: {:?}", e));
    }

    Ok(true)
}

pub async fn delete_temporary_images(app_dir: &PathBuf) -> Result<(), String> {
    let images_dir_path = app_dir.join("images");

    if !images_dir_path.exists() {
        return Ok(());
    }

    let entries = std::fs::read_dir(&images_dir_path)
        .map_err(|e| format!("Failed to read images directory: {:?}", e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {:?}", e))?;
        let path = entry.path();

        if !path.is_file() {
            continue;
        }

        let file_name = path.file_name();

        if file_name.is_none() {
            continue;
        }
        let file_name = file_name.unwrap().to_str();

        if file_name.is_none() {
            continue;
        }
        let file_name = file_name.unwrap();

        if !file_name.starts_with("temp_") {
            continue;
        }

        modify_guard::delete_single_file(&path, &DeletionGuard::new(&images_dir_path))
            .map_err(|e| format!("Failed to delete temp image: {:?}", e))?;
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use model::{AssetDescription, Avatar};

    use super::*;
    use std::{fs::File, io::Write};

    // Helper function to set up test directory
    async fn setup_test_dir(dir_path: &str) -> PathBuf {
        let path = PathBuf::from(dir_path);

        if std::fs::exists(&path).unwrap() {
            std::fs::remove_dir_all(&path).unwrap();
        }

        std::fs::create_dir_all(&path).unwrap();
        std::fs::create_dir_all(path.join("data")).unwrap();
        std::fs::create_dir_all(path.join("metadata")).unwrap();
        std::fs::create_dir_all(path.join("images")).unwrap();

        path
    }

    // Helper function to create a test image
    fn create_test_image(app_dir: &PathBuf, filename: &str) -> String {
        let images_dir = app_dir.join("images");
        let image_path = images_dir.join(filename);

        let mut file = File::create(&image_path).unwrap();
        file.write_all(b"test image content").unwrap();

        filename.to_string()
    }

    // Helper function to create a test asset directory
    fn create_test_asset_dir(app_dir: &PathBuf, id: &Uuid) {
        let asset_dir = app_dir.join("data").join(id.to_string());
        std::fs::create_dir_all(&asset_dir).unwrap();

        let test_file_path = asset_dir.join("test_file.txt");
        let mut file = File::create(test_file_path).unwrap();
        file.write_all(b"test asset content").unwrap();
    }

    #[tokio::test]
    async fn test_delete_asset_image() {
        let app_dir = setup_test_dir("test/temp/delete_asset_image").await;

        // Create a test image
        let filename = "test_image.jpg";
        create_test_image(&app_dir, filename);

        // Verify the image exists
        let image_path = app_dir.join("images").join(filename);
        assert!(image_path.exists());

        // Delete the image
        let result = delete_asset_image(&app_dir, filename).await;

        // Verify the result and that the image was deleted
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), true);
        assert!(!image_path.exists());

        // Test deleting a non-existent image
        let result = delete_asset_image(&app_dir, "non_existent.jpg").await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), true);
    }

    #[tokio::test]
    async fn test_delete_temporary_images() {
        let app_dir = setup_test_dir("test/temp/delete_temporary_images").await;

        // Create some temporary images
        create_test_image(&app_dir, "temp_1.jpg");
        create_test_image(&app_dir, "temp_2.jpg");

        // Create some non-temporary images
        create_test_image(&app_dir, "normal_1.jpg");
        create_test_image(&app_dir, "normal_2.jpg");

        // Verify all images exist
        assert!(app_dir.join("images").join("temp_1.jpg").exists());
        assert!(app_dir.join("images").join("temp_2.jpg").exists());
        assert!(app_dir.join("images").join("normal_1.jpg").exists());
        assert!(app_dir.join("images").join("normal_2.jpg").exists());

        // Delete temporary images
        let result = delete_temporary_images(&app_dir).await;

        // Verify the result and that only temporary images were deleted
        assert!(result.is_ok());
        assert!(!app_dir.join("images").join("temp_1.jpg").exists());
        assert!(!app_dir.join("images").join("temp_2.jpg").exists());
        assert!(app_dir.join("images").join("normal_1.jpg").exists());
        assert!(app_dir.join("images").join("normal_2.jpg").exists());
    }

    #[tokio::test]
    async fn test_delete_asset_from_store() {
        let app_dir = setup_test_dir("test/temp/delete_asset_from_store").await;

        // Create a test storage
        let storage = AssetStorage::create(&app_dir).unwrap();
        let store = storage.get_avatar_store();

        // Create a test asset with an image
        let asset_id = Uuid::new_v4();
        let image_filename = create_test_image(&app_dir, "test_avatar_image.jpg");
        create_test_asset_dir(&app_dir, &asset_id);

        let avatar = Avatar {
            id: asset_id,
            description: AssetDescription {
                name: "Test Avatar".into(),
                creator: "Test Creator".into(),
                image_filename: Some(image_filename),
                tags: vec!["test".into()],
                memo: Some("Test memo".into()),
                booth_item_id: None,
                dependencies: vec![],
                created_at: 1234567890000,
                published_at: None,
            },
        };

        // Add the asset to the store
        store.add_asset_and_save(avatar).await.unwrap();

        // Verify the asset exists
        assert!(store.get_asset(asset_id).await.is_some());
        assert!(app_dir.join("data").join(asset_id.to_string()).exists());
        assert!(
            app_dir
                .join("images")
                .join("test_avatar_image.jpg")
                .exists()
        );

        // Delete the asset
        let result = delete_asset_from_store(&app_dir, store, asset_id).await;

        // Verify the result and that the asset was deleted
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), true);
        assert!(store.get_asset(asset_id).await.is_none());
        assert!(!app_dir.join("data").join(asset_id.to_string()).exists());
        assert!(
            !app_dir
                .join("images")
                .join("test_avatar_image.jpg")
                .exists()
        );

        // Test deleting a non-existent asset
        let non_existent_id = Uuid::new_v4();
        let result = delete_asset_from_store(&app_dir, store, non_existent_id).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), false);
    }
}
