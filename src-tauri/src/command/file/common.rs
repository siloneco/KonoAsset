use std::{collections::HashMap, fs, path::PathBuf};

use tauri::{async_runtime::Mutex, State};
use uuid::Uuid;

use crate::{
    data_store::{find::find_unitypackage, provider::StoreProvider},
    definitions::entities::FileInfo,
    preference::store::PreferenceStore,
};

#[tauri::command]
#[specta::specta]
pub async fn get_directory_path(
    basic_store: State<'_, Mutex<StoreProvider>>,
    id: Uuid,
) -> Result<String, String> {
    let mut app_dir = basic_store.lock().await.data_dir();
    app_dir.push("data");
    app_dir.push(id.to_string());

    Ok(app_dir.to_str().unwrap().to_string())
}

#[tauri::command]
#[specta::specta]
pub async fn list_unitypackage_files(
    basic_store: State<'_, Mutex<StoreProvider>>,
    id: Uuid,
) -> Result<HashMap<String, Vec<FileInfo>>, String> {
    let mut dir = basic_store.lock().await.data_dir();
    dir.push("data");
    dir.push(id.to_string());

    if !dir.exists() {
        return Err("Directory does not exist".into());
    }

    let result = find_unitypackage(&dir);

    if let Err(e) = result {
        return Err(e);
    }

    let result = result.unwrap();

    Ok(result)
}

#[tauri::command]
#[specta::specta]
pub async fn migrate_data_dir(
    preference: State<'_, Mutex<PreferenceStore>>,
    basic_store: State<'_, Mutex<StoreProvider>>,
    new_path: PathBuf,
    migrate_data: bool,
) -> Result<(), String> {
    log::info!("Data directory migration triggered (dest: {:?})", new_path);

    if !new_path.is_dir() {
        let err = format!("New path is not a directory: {:?}", new_path);
        log::error!("{}", err);
        return Err(err);
    }

    if !new_path.exists() {
        log::debug!("Creating directory: {:?}", new_path);
        fs::create_dir_all(&new_path).unwrap();
    }

    if migrate_data {
        log::info!("Migrating data to new path: {:?}", new_path);
        let mut basic_store = basic_store.lock().await;
        let result = basic_store.migrate_data_dir(&new_path).await;

        if let Err(e) = result {
            log::error!("Failed to migrate data: {:?}", e);
            return Err(e);
        }

        log::info!("Data migration completed");
    }

    let mut preference = preference.lock().await;
    let mut new_preference = preference.clone();
    new_preference.set_data_dir(new_path.clone());

    preference.overwrite(&new_preference);
    preference.save().map_err(|e| e.to_string())?;

    log::info!("Successfully changed data directory to: {:?}", new_path);

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub async fn get_image_absolute_path(
    basic_store: State<'_, Mutex<StoreProvider>>,
    filename: String,
) -> Result<String, String> {
    let mut path = basic_store.lock().await.data_dir();
    path.push("images");
    path.push(filename);

    Ok(path.to_str().unwrap().to_string())
}
