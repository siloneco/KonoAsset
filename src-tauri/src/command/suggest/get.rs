use std::{collections::HashSet, sync::Arc};

use tauri::{async_runtime::Mutex, State};

use crate::data_store::provider::StoreProvider;

#[tauri::command]
#[specta::specta]
pub async fn get_all_asset_tags(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
) -> Result<Vec<String>, String> {
    let basic_store = basic_store.lock().await;
    let mut tags: HashSet<String> = HashSet::new();

    basic_store
        .get_avatar_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            asset.description.tags.iter().for_each(|tag| {
                tags.insert(tag.clone());
            });
        });

    basic_store
        .get_avatar_wearable_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            asset.description.tags.iter().for_each(|tag| {
                tags.insert(tag.clone());
            });
        });

    basic_store
        .get_world_object_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            asset.description.tags.iter().for_each(|tag| {
                tags.insert(tag.clone());
            });
        });

    Ok(tags.into_iter().collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_supported_avatar_values(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
) -> Result<Vec<String>, String> {
    let mut values: HashSet<String> = HashSet::new();

    basic_store
        .lock()
        .await
        .get_avatar_wearable_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            asset.supported_avatars.iter().for_each(|val| {
                values.insert(val.clone());
            });
        });

    Ok(values.into_iter().collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_avatar_wearable_categories(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
) -> Result<Vec<String>, String> {
    let mut categories: HashSet<String> = HashSet::new();

    basic_store
        .lock()
        .await
        .get_avatar_wearable_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            let val = asset.category.clone();
            let val = val.trim();
            if val.is_empty() {
                return;
            }
            categories.insert(val.to_string());
        });

    Ok(categories.into_iter().collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_world_object_categories(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
) -> Result<Vec<String>, String> {
    let mut categories: HashSet<String> = HashSet::new();

    basic_store
        .lock()
        .await
        .get_world_object_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            let val = asset.category.clone();
            let val = val.trim();
            if val.is_empty() {
                return;
            }
            categories.insert(val.to_string());
        });

    Ok(categories.into_iter().collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_avatar_wearable_supported_avatars(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
) -> Result<Vec<String>, String> {
    let mut supported_avatars: HashSet<String> = HashSet::new();

    basic_store
        .lock()
        .await
        .get_avatar_wearable_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            asset.supported_avatars.iter().for_each(|val| {
                supported_avatars.insert(val.clone());
            });
        });

    Ok(supported_avatars.into_iter().collect())
}
