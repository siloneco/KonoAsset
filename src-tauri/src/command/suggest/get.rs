use std::{collections::HashMap, sync::Arc};

use serde::Serialize;
use tauri::{async_runtime::Mutex, State};
use uuid::Uuid;

use crate::{data_store::provider::StoreProvider, definitions::entities::AssetType};

#[derive(Serialize, Clone, Debug, PartialEq, Eq, specta::Type)]
pub struct PrioritizedEntry {
    priority: u32,
    value: String,
}

#[tauri::command]
#[specta::specta]
pub async fn get_asset_tags(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    asset_type: Option<AssetType>,
    allowed_ids: Option<Vec<Uuid>>,
) -> Result<Vec<PrioritizedEntry>, String> {
    let basic_store = basic_store.lock().await;
    let mut tags: HashMap<String, u32> = HashMap::new();

    if asset_type.is_none() || asset_type.unwrap() == AssetType::Avatar {
        basic_store
            .get_avatar_store()
            .get_all()
            .await
            .iter()
            .for_each(|asset| {
                if let Some(allowed_ids) = &allowed_ids {
                    if !allowed_ids.contains(&asset.id) {
                        return;
                    }
                }

                asset.description.tags.iter().for_each(|tag| {
                    let count = tags.entry(tag.clone()).or_insert(0);
                    *count += 1;
                });
            });
    }

    if asset_type.is_none() || asset_type.unwrap() == AssetType::AvatarWearable {
        basic_store
            .get_avatar_wearable_store()
            .get_all()
            .await
            .iter()
            .for_each(|asset| {
                if let Some(allowed_ids) = &allowed_ids {
                    if !allowed_ids.contains(&asset.id) {
                        return;
                    }
                }

                asset.description.tags.iter().for_each(|tag| {
                    let count = tags.entry(tag.clone()).or_insert(0);
                    *count += 1;
                });
            });
    }

    if asset_type.is_none() || asset_type.unwrap() == AssetType::WorldObject {
        basic_store
            .get_world_object_store()
            .get_all()
            .await
            .iter()
            .for_each(|asset| {
                if let Some(allowed_ids) = &allowed_ids {
                    if !allowed_ids.contains(&asset.id) {
                        return;
                    }
                }

                asset.description.tags.iter().for_each(|tag| {
                    let count = tags.entry(tag.clone()).or_insert(0);
                    *count += 1;
                });
            });
    }

    Ok(tags
        .iter()
        .map(|(key, value)| PrioritizedEntry {
            priority: *value,
            value: key.clone(),
        })
        .collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_supported_avatar_values(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    allowed_ids: Option<Vec<Uuid>>,
) -> Result<Vec<PrioritizedEntry>, String> {
    let mut values: HashMap<String, u32> = HashMap::new();

    basic_store
        .lock()
        .await
        .get_avatar_wearable_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            let allowed = if let Some(allowed_ids) = &allowed_ids {
                allowed_ids.contains(&asset.id)
            } else {
                true
            };

            asset.supported_avatars.iter().for_each(|val| {
                let count = values.entry(val.clone()).or_insert(0);

                if !allowed {
                    return;
                }

                *count += 1;
            });
        });

    Ok(values
        .iter()
        .map(|(key, value)| PrioritizedEntry {
            priority: *value,
            value: key.clone(),
        })
        .collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_avatar_wearable_categories(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    allowed_ids: Option<Vec<Uuid>>,
) -> Result<Vec<PrioritizedEntry>, String> {
    let mut categories: HashMap<String, u32> = HashMap::new();

    basic_store
        .lock()
        .await
        .get_avatar_wearable_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            let allowed = if let Some(allowed_ids) = &allowed_ids {
                allowed_ids.contains(&asset.id)
            } else {
                true
            };

            let val = asset.category.clone();
            let val = val.trim();
            if val.is_empty() {
                return;
            }

            let count = categories.entry(val.to_string()).or_insert(0);

            if !allowed {
                return;
            }

            *count += 1;
        });

    Ok(categories
        .iter()
        .map(|(key, value)| PrioritizedEntry {
            priority: *value,
            value: key.clone(),
        })
        .collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_world_object_categories(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    allowed_ids: Option<Vec<Uuid>>,
) -> Result<Vec<PrioritizedEntry>, String> {
    let mut categories: HashMap<String, u32> = HashMap::new();

    basic_store
        .lock()
        .await
        .get_world_object_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            let allowed = if let Some(allowed_ids) = &allowed_ids {
                allowed_ids.contains(&asset.id)
            } else {
                true
            };

            let val = asset.category.clone();
            let val = val.trim();
            if val.is_empty() {
                return;
            }

            let count = categories.entry(val.to_string()).or_insert(0);

            if !allowed {
                return;
            }

            *count += 1;
        });

    Ok(categories
        .iter()
        .map(|(key, value)| PrioritizedEntry {
            priority: *value,
            value: key.clone(),
        })
        .collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_avatar_wearable_supported_avatars(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    allowed_ids: Option<Vec<Uuid>>,
) -> Result<Vec<PrioritizedEntry>, String> {
    let mut supported_avatars: HashMap<String, u32> = HashMap::new();

    basic_store
        .lock()
        .await
        .get_avatar_wearable_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            let allowed = if let Some(allowed_ids) = &allowed_ids {
                allowed_ids.contains(&asset.id)
            } else {
                true
            };

            asset.supported_avatars.iter().for_each(|val| {
                let val = val.trim();
                if val.is_empty() {
                    return;
                }

                let count = supported_avatars.entry(val.to_string()).or_insert(0);

                if !allowed {
                    return;
                }

                *count += 1;
            });
        });

    Ok(supported_avatars
        .iter()
        .map(|(key, value)| PrioritizedEntry {
            priority: *value,
            value: key.clone(),
        })
        .collect())
}
