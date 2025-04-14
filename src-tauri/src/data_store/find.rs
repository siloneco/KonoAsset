use std::{collections::HashMap, ffi::OsStr, path::Path};

use crate::definitions::entities::FileInfo;

const IGNORE_DIRECTORY_NAMES: [&str; 1] = ["__MACOSX"];

pub fn find_unitypackage<P: AsRef<Path>>(dir: P) -> Result<HashMap<String, Vec<FileInfo>>, String> {
    let dir = dir.as_ref();

    let mut unitypackages = HashMap::new();

    let entries = std::fs::read_dir(dir).map_err(|e| e.to_string())?;

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
            let dir_name = dir_name.unwrap().to_string_lossy();

            if IGNORE_DIRECTORY_NAMES.contains(&dir_name.as_ref()) {
                continue;
            }

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
        if extension.to_ascii_lowercase() != "unitypackage" {
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_find_unitypackage() {
        let dir = "test/temp/find_unitypackage";

        if std::fs::exists(dir).unwrap() {
            std::fs::remove_dir_all(dir).unwrap();
        }

        std::fs::create_dir_all(dir).unwrap();

        std::fs::create_dir_all(format!("{dir}/test")).unwrap();
        std::fs::create_dir_all(format!("{dir}/__MACOSX")).unwrap();

        let normal_filename = "normal.unitypackage";
        let case_insensitive_filename = "case-insensitive.UniTypAckaGE";
        let inside_dir_filename = "inside-dir.unitypackage";

        std::fs::write(format!("{dir}/{normal_filename}"), "").unwrap();
        std::fs::write(format!("{dir}/{case_insensitive_filename}"), "").unwrap();
        std::fs::write(format!("{dir}/not-unitypackage.txt"), "").unwrap();

        std::fs::write(format!("{dir}/test/{inside_dir_filename}"), "").unwrap();
        std::fs::write(format!("{dir}/test/not-unitypackage.txt"), "").unwrap();

        std::fs::write(format!("{dir}/__MACOSX/inside-macosx.unitypackage"), "").unwrap();

        let result = find_unitypackage(dir).unwrap();

        assert_eq!(result.len(), 2);

        let top = result.get("").unwrap();
        let inside_dir = result.get("test/").unwrap();

        assert_eq!(top.len(), 2);

        assert_eq!(inside_dir.len(), 1);
        assert_eq!(result.get("__MACOSX").is_none(), true);

        assert_eq!(top[0].file_name, case_insensitive_filename);
        assert_eq!(top[1].file_name, normal_filename);

        assert_eq!(
            result.get("test/").unwrap()[0].file_name,
            inside_dir_filename
        );
    }
}
