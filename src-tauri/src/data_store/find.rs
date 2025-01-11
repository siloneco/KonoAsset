use std::{collections::HashMap, path::PathBuf};

use crate::definitions::entities::FileInfo;

pub fn find_unitypackage(dir: &PathBuf) -> Result<HashMap<String, Vec<FileInfo>>, String> {
    let mut unitypackages = HashMap::new();
    let path = dir.clone();

    let entries = std::fs::read_dir(&path).map_err(|e| e.to_string())?;

    for entry in entries {
        if entry.is_err() {
            println!("Error reading entry: {:?}", entry.err());
            continue;
        }
        let entry = entry.unwrap();

        let path = entry.path();
        if path.is_dir() {
            let mut result = find_unitypackage(&path)?;
            let dir_name = path.file_name().unwrap().to_str().unwrap().to_string();

            for (key, value) in result.drain() {
                let unitypackage = unitypackages
                    .entry(format!("{dir_name}/{key}"))
                    .or_insert(Vec::new());
                unitypackage.append(&mut value.clone());
            }
            continue;
        }

        let extension = path.extension().unwrap().to_ascii_lowercase();
        if extension != "unitypackage" {
            continue;
        }

        let file_name = path.file_name().unwrap().to_str().unwrap();
        let absolute_path = path.to_str().unwrap();

        let file_info = FileInfo::new(file_name.to_string(), absolute_path.to_string());

        let unitypackage = unitypackages.entry("".into()).or_insert(Vec::new());
        unitypackage.push(file_info);
    }

    Ok(unitypackages)
}
