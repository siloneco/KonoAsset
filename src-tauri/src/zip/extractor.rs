use log::{debug, warn};
use std::{
    io::{Read, Write},
    path::{PathBuf, MAIN_SEPARATOR_STR},
};
use zip::ZipArchive;

pub fn extract_zip(src: &PathBuf, dest: &PathBuf) -> Result<(), String> {
    let reader = std::fs::File::open(src).map_err(|e| format!("Failed to open zip file: {}", e))?;
    let mut archive =
        ZipArchive::new(reader).map_err(|e| format!("Failed to read zip file: {}", e))?;

    let absolute_dest = std::path::absolute(dest).unwrap();

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
        let name = sanitize(fix_encoding(file.name_raw()).as_str());

        if name.len() == 0 {
            warn!("Ignoring empty file name");
            continue;
        }

        let path = absolute_dest.join(name);
        let absolute_path = std::path::absolute(path).unwrap();

        if !absolute_path
            .to_str()
            .unwrap()
            .starts_with(absolute_dest.to_str().unwrap())
        {
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

fn fix_encoding(name: &[u8]) -> String {
    encoding_rs::SHIFT_JIS.decode(name).0.to_string()
}

fn sanitize(name: &str) -> String {
    name.replace("\0", "").replace("\u{202E}", "")
}
