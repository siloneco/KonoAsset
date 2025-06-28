use serde::Serialize;
use std::path::{Path, PathBuf};

#[derive(Serialize, Debug, PartialEq, Eq, specta::Type)]
#[serde(rename_all = "camelCase")]
pub enum EntryType {
    Directory,
    File,
}

#[derive(Serialize, Debug, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct SimplifiedDirEntry {
    pub entry_type: EntryType,
    pub name: String,
    pub absolute_path: PathBuf,
}

impl SimplifiedDirEntry {
    pub fn directory(name: String, absolute_path: PathBuf) -> Self {
        Self {
            entry_type: EntryType::Directory,
            name,
            absolute_path,
        }
    }

    pub fn file(name: String, absolute_path: PathBuf) -> Self {
        Self {
            entry_type: EntryType::File,
            name,
            absolute_path,
        }
    }
}

pub async fn list_top_files_and_directories<P: AsRef<Path>>(
    path: P,
) -> Result<Vec<SimplifiedDirEntry>, tokio::io::Error> {
    let path = path.as_ref();
    let mut entries = tokio::fs::read_dir(path).await?;
    let mut result = vec![];

    while let Some(entry) = entries.next_entry().await? {
        let entry_path = entry.path();

        let is_file = entry_path.is_file();
        let is_dir = entry_path.is_dir();

        if !is_file && !is_dir {
            continue;
        }

        let absolute_path = std::path::absolute(&entry_path);
        if let Err(e) = absolute_path {
            log::warn!("Failed to get absolute path: {:?}", e);
            continue;
        }
        let absolute_path = absolute_path.unwrap();

        let name = entry_path.file_name();
        if name.is_none() {
            continue;
        }

        let name = name.unwrap().to_str();
        if name.is_none() {
            continue;
        }

        let name = name.unwrap().to_string();

        if is_file {
            result.push(SimplifiedDirEntry::file(name, absolute_path));
        } else if is_dir {
            result.push(SimplifiedDirEntry::directory(name, absolute_path));
        }
    }

    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_list_top_files_and_directories() {
        let path = "test/temp/list_top_files_and_directories";
        let absolute_path = std::path::absolute(path).unwrap();

        if std::fs::exists(path).unwrap() {
            std::fs::remove_dir_all(path).unwrap();
        }

        std::fs::create_dir_all(path).unwrap();

        std::fs::write(format!("{}/file1.txt", path), b"dummy").unwrap();
        std::fs::write(format!("{}/file2.txt", path), b"dummy").unwrap();
        std::fs::create_dir(format!("{}/dir1", path)).unwrap();
        std::fs::write(format!("{}/dir1/file3.txt", path), b"dummy").unwrap();

        let result = list_top_files_and_directories(path).await.unwrap();

        assert_eq!(result.len(), 3);

        assert!(result
            .iter()
            .any(|entry| entry.entry_type == EntryType::Directory
                && entry.name == "dir1"
                && entry.absolute_path == absolute_path.join("dir1")));
        assert!(result
            .iter()
            .any(|entry| entry.entry_type == EntryType::File
                && entry.name == "file1.txt"
                && entry.absolute_path == absolute_path.join("file1.txt")));
        assert!(result
            .iter()
            .any(|entry| entry.entry_type == EntryType::File
                && entry.name == "file2.txt"
                && entry.absolute_path == absolute_path.join("file2.txt")));
    }
}
