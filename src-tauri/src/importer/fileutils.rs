use std::{error::Error, fs, path::PathBuf};

use zip_extensions::zip_extract;

pub async fn execute_image_fixation(src: &PathBuf) -> Result<Option<PathBuf>, String> {
    if !src.exists() {
        return Err(format!("File not found: {:?}", src));
    }

    let filename = src.file_name().unwrap().to_str().unwrap();
    if !filename.starts_with("temp_") {
        return Ok(None);
    }

    let new_filename = &filename[5..];
    let new_path = src.with_file_name(new_filename);
    let result = fs::rename(src, &new_path);
    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    return Ok(Some(new_path));
}

pub fn import_asset(
    src_import_asset_path: &PathBuf,
    destination: &PathBuf,
    delete_source: bool,
) -> Result<(), Box<dyn Error>> {
    let mut new_destination = destination.clone();
    new_destination.push(src_import_asset_path.file_name().unwrap());

    if src_import_asset_path.is_dir() {
        fs::create_dir_all(&new_destination)?;

        copy_dir(src_import_asset_path, &new_destination)?;

        if delete_source {
            delete(src_import_asset_path)?;
        }
    } else {
        let extension = src_import_asset_path.extension().unwrap();
        if extension == "zip" {
            new_destination.pop();

            let result = extract_zip(src_import_asset_path, &new_destination);

            if let Err(e) = result {
                return Err(e.into());
            }

            if delete_source {
                delete(src_import_asset_path)?;
            }
        } else {
            copy_file(src_import_asset_path, &new_destination)?;
            if delete_source {
                delete(src_import_asset_path)?;
            }
        }
    }
    Ok(())
}

fn copy_dir(src: &PathBuf, dest: &PathBuf) -> Result<(), Box<dyn Error>> {
    fs::create_dir_all(dest)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            copy_dir(&path, &dest.join(path.file_name().unwrap()))?;
        } else {
            fs::copy(&path, &dest.join(path.file_name().unwrap()))?;
        }
    }
    Ok(())
}

fn copy_file(src: &PathBuf, dest: &PathBuf) -> Result<(), Box<dyn Error>> {
    fs::copy(src, dest)?;
    Ok(())
}

fn delete(src: &PathBuf) -> Result<(), Box<dyn Error>> {
    if src.is_dir() {
        fs::remove_dir_all(src)?;
    } else {
        fs::remove_file(src)?;
    }
    Ok(())
}

fn extract_zip(src: &PathBuf, dest: &PathBuf) -> Result<(), String> {
    let result = zip_extract(src, dest);

    if result.is_err() {
        return Err(result.err().unwrap().to_string());
    }

    Ok(())
}
