use std::{path::Path, time::Duration};

use async_read_progress::AsyncReadProgressExt;
use async_zip::{error::ZipError, tokio::read::seek::ZipFileReader};
use tokio_util::compat::FuturesAsyncReadCompatExt;

pub async fn extract_zip<P, Q>(
    src: P,
    dest: Q,
    progress_callback: impl Fn(f32, String),
) -> Result<(), String>
where
    P: AsRef<Path>,
    Q: AsRef<Path>,
{
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
        let uncompressed_size = entry.uncompressed_size();

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
                .map_err(|e| format!("Failed to read zip entry: {}", e))?
                .report_progress(Duration::from_millis(100), |bytes_read| {
                    if uncompressed_size == 0 {
                        return;
                    }

                    let completed = bytes_read as f32 / uncompressed_size as f32;

                    progress_callback(
                        (i as f32 + completed) / entry_length as f32,
                        filename.clone(),
                    );
                });

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

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_extract_normal_zip() {
        let src = "test/normal.zip";
        let dest = "test/temp/extracted-normal-zip";

        if std::fs::exists(dest).unwrap() {
            tokio::fs::remove_dir_all(dest).await.unwrap();
        }

        let progress_callback = |_, _| {};

        extract_zip(src, dest, progress_callback).await.unwrap();

        let dummy1_txt_path = format!("{dest}/dummy1.txt");
        let dummy2_txt_path = format!("{dest}/dummy-dir/dummy2.txt");

        assert!(std::fs::exists(&dummy1_txt_path).unwrap());
        assert!(std::fs::exists(&dummy2_txt_path).unwrap());

        assert_eq!(std::fs::read_to_string(&dummy1_txt_path).unwrap(), "dummy1");
        assert_eq!(std::fs::read_to_string(&dummy2_txt_path).unwrap(), "dummy2");
    }

    #[tokio::test]
    async fn test_extract_shift_jis_zip() {
        let src = "test/shift-jis.zip";
        let dest = "test/temp/extracted-shift-jis-zip";

        if std::fs::exists(dest).unwrap() {
            tokio::fs::remove_dir_all(dest).await.unwrap();
        }

        let progress_callback = |_, _| {};

        extract_zip(src, dest, progress_callback).await.unwrap();

        let dummy1_txt_path = format!(
            "{dest}/これはShift-JISでエンコードされたファイル名が正しくデコードされるかを確認するためのファイル1.txt"
        );
        let dummy2_txt_path = format!(
            "{dest}/確認用フォルダ/これはShift-JISでエンコードされたファイル名が正しくデコードされるかを確認するためのファイル2.txt"
        );

        assert!(std::fs::exists(&dummy1_txt_path).unwrap());
        assert!(std::fs::exists(&dummy2_txt_path).unwrap());

        assert_eq!(std::fs::read_to_string(&dummy1_txt_path).unwrap(), "dummy1");
        assert_eq!(std::fs::read_to_string(&dummy2_txt_path).unwrap(), "dummy2");
    }
}
