use log::{debug, warn};
use std::{
    io::{Read, Write},
    path::{PathBuf, MAIN_SEPARATOR_STR},
};
use zip::{HasZipMetadata, ZipArchive};

pub fn extract_zip(src: &PathBuf, dest: &PathBuf) -> Result<(), String> {
    let reader = std::fs::File::open(src).map_err(|e| format!("Failed to open zip file: {}", e))?;
    let mut archive =
        ZipArchive::new(reader).map_err(|e| format!("Failed to read zip file: {}", e))?;

    let absolute_dest =
        std::path::absolute(dest).map_err(|e| format!("Failed to get absolute path: {}", e))?;

    if absolute_dest.is_file() {
        return Err(format!("Invalid path: {}", absolute_dest.display()));
    }

    if !absolute_dest.exists() {
        std::fs::create_dir_all(&absolute_dest)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    for i in 0..archive.len() {
        let mut file = archive
            .by_index(i)
            .map_err(|e| format!("Failed to read zip file: {}", e))?;
        let name = if file.get_metadata().is_utf8 {
            let enclosed_name = file.enclosed_name();
            if enclosed_name.is_none() {
                let text = format!("Failed to read file name: {:?}", file.name_raw());
                warn!("{}", text);
                return Err(format!("Failed to extract file from zip file: {}", text));
            }

            let enclosed_name = enclosed_name.unwrap();
            let enclosed_name = enclosed_name.to_str();
            if enclosed_name.is_none() {
                let text = format!("Failed to read file name: {:?}", file.name_raw());
                warn!("{}", text);
                return Err(format!("Failed to extract file from zip file: {}", text));
            }

            enclosed_name.unwrap().to_string()
        } else {
            sanitize(decode_as_shift_jis(file.name_raw()).as_str())
        };

        if name.len() == 0 {
            warn!("Ignoring empty file name");
            continue;
        }

        let path = absolute_dest.join(name);
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

        debug!("Extracting: {:?}", absolute_path);

        if absolute_path
            .to_string_lossy()
            .ends_with(MAIN_SEPARATOR_STR)
            || absolute_path.is_dir()
        {
            std::fs::create_dir_all(&absolute_path)
                .map_err(|e| format!("Failed to create directory: {}", e))?;
        } else {
            if let Some(parent) = absolute_path.parent() {
                if !parent.exists() {
                    std::fs::create_dir_all(&parent)
                        .map_err(|e| format!("Failed to create directory: {}", e))?;
                }
            }

            let mut buffer: Vec<u8> = Vec::new();
            let _bytes_read = file.read_to_end(&mut buffer);

            let mut file = std::fs::File::create(absolute_path)
                .map_err(|e| format!("Failed to create file: {}", e))?;
            file.set_len(0)
                .map_err(|e| format!("Failed to create file: {}", e))?;
            file.write(&buffer)
                .map_err(|e| format!("Failed to write file: {}", e))?;
        }
    }

    Ok(())
}

fn decode_as_shift_jis(name: &[u8]) -> String {
    encoding_rs::SHIFT_JIS.decode(name).0.to_string()
}

fn sanitize(name: &str) -> String {
    name.replace("\0", "")
        .replace("\u{202E}", "")
        .replace("/", MAIN_SEPARATOR_STR)
}
