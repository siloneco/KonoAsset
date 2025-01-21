use std::{collections::HashMap, ffi::OsStr, path::PathBuf};

use crate::definitions::entities::FileInfo;

pub fn find_unitypackage(dir: &PathBuf) -> Result<HashMap<String, Vec<FileInfo>>, String> {
    let mut unitypackages = HashMap::new();
    let path = dir.clone();

    let entries = std::fs::read_dir(&path).map_err(|e| e.to_string())?;

    for entry in entries {
        if let Err(e) = entry {
            log::error!("Error reading entry: {:?}", e);
            continue;
        }
        let entry = entry.unwrap();

        let path = entry.path();
        if path.is_dir() {
            let mut result = find_unitypackage(&path)?;
            let dir_name = path.file_name();

            if dir_name.is_none() {
                continue;
            }
            let dir_name = dir_name.unwrap().to_str();

            if dir_name.is_none() {
                continue;
            }
            let dir_name = dir_name.unwrap().to_string();

            for (key, value) in result.drain() {
                let unitypackage = unitypackages
                    .entry(format!("{dir_name}/{key}"))
                    .or_insert(Vec::new());
                unitypackage.append(&mut value.clone());
            }
            continue;
        }

        let extension = path
            .extension()
            .unwrap_or(OsStr::new(""))
            .to_str()
            .unwrap_or("");
        if extension != "unitypackage" {
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

        let absolute_path = std::path::absolute(&path).map_err(|e| e.to_string())?;

        let absolute_path = absolute_path.to_str();
        if absolute_path.is_none() {
            continue;
        }
        let absolute_path = absolute_path.unwrap().to_string();

        let file_info = FileInfo::new(file_name.to_string(), absolute_path);

        let unitypackage = unitypackages.entry("".into()).or_insert(Vec::new());
        unitypackage.push(file_info);
    }

    Ok(unitypackages)
}
