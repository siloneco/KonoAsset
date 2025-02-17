use std::{collections::HashMap, path::PathBuf, sync::Arc};

use tauri::{async_runtime::Mutex, State};
use uuid::Uuid;

use crate::{
    data_store::{
        find::find_unitypackage,
        provider::{MigrateResult, StoreProvider},
    },
    definitions::entities::FileInfo,
    preference::store::PreferenceStore,
};

#[tauri::command]
#[specta::specta]
pub async fn get_directory_path(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    id: Uuid,
) -> Result<String, String> {
    let mut app_dir = basic_store.lock().await.data_dir();
    app_dir.push("data");
    app_dir.push(id.to_string());

    match app_dir.to_str() {
        Some(ans) => Ok(ans.to_string()),
        None => return Err(format!("Failed to convert path to string (id = {:?})", id)),
    }
}

#[tauri::command]
#[specta::specta]
pub async fn list_unitypackage_files(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    id: Uuid,
) -> Result<HashMap<String, Vec<FileInfo>>, String> {
    let mut dir = basic_store.lock().await.data_dir();
    dir.push("data");
    dir.push(id.to_string());

    if !dir.exists() {
        return Err("Directory does not exist".into());
    }

    Ok(find_unitypackage(&dir)?)
}

#[tauri::command]
#[specta::specta]
pub async fn migrate_data_dir(
    preference: State<'_, Arc<Mutex<PreferenceStore>>>,
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    new_path: PathBuf,
    migrate_data: bool,
) -> Result<Option<MigrateResult>, String> {
    log::info!(
        "Data directory migration triggered (dest: {})",
        new_path.display()
    );

    if !new_path.is_dir() {
        let err = format!("New path is not a directory: {}", new_path.display());
        log::error!("{}", err);
        return Err(err);
    }

    if !new_path.exists() {
        log::debug!("Creating directory: {}", new_path.display());
        std::fs::create_dir_all(&new_path)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    let migrate_result = if migrate_data {
        log::info!("Migrating data to new path: {}", new_path.display());
        let mut basic_store = basic_store.lock().await;
        let result = basic_store.migrate_data_dir(&new_path).await.map_err(|e| {
            let msg = format!("Failed to migrate data: {:?}", e);
            log::error!("{}", msg);
            msg
        })?;

        if result == MigrateResult::Migrated {
            log::info!("Data migration completed");
        } else if result == MigrateResult::MigratedButFailedToDeleteOldDir {
            log::warn!("Data migration completed, but failed to delete old directory");
        }

        Some(result)
    } else {
        None
    };

    let mut preference = preference.lock().await;
    let mut new_preference = preference.clone();
    new_preference.set_data_dir(new_path.clone());

    preference.overwrite(&new_preference);
    preference.save().map_err(|e| e.to_string())?;

    log::info!(
        "Successfully changed data directory to: {}",
        new_path.display()
    );

    Ok(migrate_result)
}

#[tauri::command]
#[specta::specta]
pub async fn get_image_absolute_path(
    basic_store: State<'_, Arc<Mutex<StoreProvider>>>,
    filename: String,
) -> Result<String, String> {
    let mut path = basic_store.lock().await.data_dir();
    path.push("images");
    path.push(&filename);

    match path.to_str() {
        Some(ans) => Ok(ans.to_string()),
        None => {
            return Err(format!(
                "Failed to get absolute path for image (filename = {})",
                filename
            ))
        }
    }
}
