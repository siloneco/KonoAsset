use serde::Serialize;
use std::path::{Path, PathBuf};

#[derive(Serialize, Debug, specta::Type)]
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
