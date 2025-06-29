use std::{collections::HashMap, sync::Arc};

use serde::Serialize;
use storage::asset_storage::AssetStorage;
use tauri::{State, async_runtime::Mutex};
use uuid::Uuid;

#[derive(Serialize, Clone, Debug, PartialEq, Eq, specta::Type)]
pub struct PrioritizedEntry {
    priority: u32,
    value: String,
}

#[tauri::command]
#[specta::specta]
pub async fn get_creator_names(
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
    allowed_ids: Option<Vec<Uuid>>,
) -> Result<Vec<PrioritizedEntry>, String> {
    let basic_store = basic_store.lock().await;
    let mut creators: HashMap<String, u32> = HashMap::new();

    basic_store
        .get_avatar_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            let allowed = if let Some(allowed_ids) = &allowed_ids {
                allowed_ids.contains(&asset.id)
            } else {
                true
            };

            if !allowed {
                return;
            }

            let creator = asset.description.creator.clone();
            let creator = creator.trim();
            if creator.is_empty() {
                return;
            }

            let count = creators.entry(creator.to_string()).or_insert(0);
            *count += 1;
        });

    basic_store
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

            if !allowed {
                return;
            }

            let creator = asset.description.creator.clone();
            let creator = creator.trim();
            if creator.is_empty() {
                return;
            }

            let count = creators.entry(creator.to_string()).or_insert(0);
            *count += 1;
        });

    basic_store
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

            if !allowed {
                return;
            }

            let creator = asset.description.creator.clone();
            let creator = creator.trim();
            if creator.is_empty() {
                return;
            }

            let count = creators.entry(creator.to_string()).or_insert(0);
            *count += 1;
        });

    basic_store
        .get_other_asset_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            let allowed = if let Some(allowed_ids) = &allowed_ids {
                allowed_ids.contains(&asset.id)
            } else {
                true
            };

            if !allowed {
                return;
            }

            let creator = asset.description.creator.clone();
            let creator = creator.trim();
            if creator.is_empty() {
                return;
            }

            let count = creators.entry(creator.to_string()).or_insert(0);
            *count += 1;
        });

    Ok(creators
        .iter()
        .map(|(key, value)| PrioritizedEntry {
            priority: *value,
            value: key.clone(),
        })
        .collect())
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_asset_tags(
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
    allowed_ids: Option<Vec<Uuid>>,
) -> Result<Vec<PrioritizedEntry>, String> {
    let basic_store = basic_store.lock().await;
    let mut tags: HashMap<String, u32> = HashMap::new();

    basic_store
        .get_avatar_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            let allowed = if let Some(allowed_ids) = &allowed_ids {
                allowed_ids.contains(&asset.id)
            } else {
                true
            };

            asset.description.tags.iter().for_each(|tag| {
                let count = tags.entry(tag.clone()).or_insert(0);

                if !allowed {
                    return;
                }

                *count += 1;
            });
        });

    basic_store
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

            asset.description.tags.iter().for_each(|tag| {
                let count = tags.entry(tag.clone()).or_insert(0);

                if !allowed {
                    return;
                }

                *count += 1;
            });
        });

    basic_store
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

            asset.description.tags.iter().for_each(|tag| {
                let count = tags.entry(tag.clone()).or_insert(0);

                if !allowed {
                    return;
                }

                *count += 1;
            });
        });

    basic_store
        .get_other_asset_store()
        .get_all()
        .await
        .iter()
        .for_each(|asset| {
            let allowed = if let Some(allowed_ids) = &allowed_ids {
                allowed_ids.contains(&asset.id)
            } else {
                true
            };

            asset.description.tags.iter().for_each(|tag| {
                let count = tags.entry(tag.clone()).or_insert(0);

                if !allowed {
                    return;
                }

                *count += 1;
            });
        });

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
pub async fn get_avatar_wearable_categories(
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
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
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
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
pub async fn get_other_asset_categories(
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
    allowed_ids: Option<Vec<Uuid>>,
) -> Result<Vec<PrioritizedEntry>, String> {
    let mut categories: HashMap<String, u32> = HashMap::new();

    basic_store
        .lock()
        .await
        .get_other_asset_store()
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
    basic_store: State<'_, Arc<Mutex<AssetStorage>>>,
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
