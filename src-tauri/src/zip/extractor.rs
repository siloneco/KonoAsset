use std::path::PathBuf;

use async_zip::{error::ZipError, tokio::read::seek::ZipFileReader};
use tokio_util::compat::FuturesAsyncReadCompatExt;

pub async fn extract_zip(
    src: &PathBuf,
    dest: &PathBuf,
    progress_callback: impl Fn(f32, String),
) -> Result<(), String> {
    let mut file = tokio::io::BufReader::new(
        tokio::fs::File::open(src)
            .await
            .map_err(|e| format!("Failed to open zip file: {}", e))?,
    );
    let mut zip = ZipFileReader::with_tokio(&mut file)
        .await
        .map_err(|e| format!("Failed to read zip file: {}", e))?;

    let absolute_dest =
        std::path::absolute(dest).map_err(|e| format!("Failed to get absolute path: {}", e))?;

    if absolute_dest.is_file() {
        return Err(format!("Invalid path: {}", absolute_dest.display()));
    }

    if !absolute_dest.exists() {
        tokio::fs::create_dir_all(&absolute_dest)
            .await
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    let entry_length = zip.file().entries().len();

    for i in 0..entry_length {
        let entry = zip.file().entries().get(i).unwrap();

        let filename = match entry.filename().as_str() {
            Ok(name) => name.to_string(),
            Err(e) => {
                let decoded_as_shift_jis = match e {
                    ZipError::StringNotUtf8 => decode_as_shift_jis(entry.filename().as_bytes()),
                    _ => {
                        return Err(format!("Failed to get file name: {}", e));
                    }
                };

                decoded_as_shift_jis
            }
        };

        if filename.len() == 0 {
            log::warn!("Ignoring empty filename");
            continue;
        }

        let filename = filename
            .replace("\\", "/")
            .split("/")
            .map(|s| sanitize_filename::sanitize(s))
            .collect::<Vec<String>>()
            .join("/");

        let entry_is_dir = match entry.dir() {
            Ok(is_dir) => is_dir,
            Err(e) => match e {
                ZipError::StringNotUtf8 => filename.ends_with('/'),
                _ => {
                    return Err(format!("Failed to get file type: {}", e));
                }
            },
        };

        let path = absolute_dest.join(&filename);
        let absolute_path =
            std::path::absolute(path).map_err(|e| format!("Failed to get absolute path: {}", e))?;

        let absolute_path_str = absolute_path.to_str();
        if absolute_path_str.is_none() {
            return Err(format!(
                "Failed to get absolute path as string: {}",
                absolute_path.display()
            ));
        }
        let absolute_path_str = absolute_path_str.unwrap();

        let dest_str = absolute_dest.to_str();
        if dest_str.is_none() {
            return Err(format!(
                "Failed to get destination path as string: {}",
                absolute_dest.display()
            ));
        }
        let dest_str = dest_str.unwrap();

        if !absolute_path_str.starts_with(dest_str) {
            return Err(format!("Invalid path: {}", absolute_path.display()));
        }

        log::debug!("Extracting: {}", absolute_path.display());

        if entry_is_dir {
            tokio::fs::create_dir_all(&absolute_path)
                .await
                .map_err(|e| format!("Failed to create directory: {}", e))?;
        } else {
            tokio::fs::create_dir_all(&absolute_path.parent().unwrap())
                .await
                .map_err(|e| format!("Failed to create directory: {}", e))?;

            let entry_reader = zip
                .reader_without_entry(i)
                .await
                .map_err(|e| format!("Failed to read zip entry: {}", e))?;

            let mut writer = tokio::fs::OpenOptions::new()
                .write(true)
                .create_new(true)
                .open(&absolute_path)
                .await
                .map_err(|e| format!("Failed to create file: {}", e))?;

            tokio::io::copy(&mut entry_reader.compat(), &mut writer)
                .await
                .map_err(|e| format!("Failed to write file: {}", e))?;
        }

        progress_callback(((i + 1) as f32) / entry_length as f32, filename);
    }

    Ok(())
}

fn decode_as_shift_jis(name: &[u8]) -> String {
    encoding_rs::SHIFT_JIS.decode(name).0.to_string()
}
