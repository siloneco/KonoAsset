use std::{error::Error, fs, path::PathBuf};

pub fn import_asset(
    src_import_asset_path: &PathBuf,
    destination: &PathBuf,
) -> Result<(), Box<dyn Error>> {
    let mut new_destination = destination.clone();
    new_destination.push(src_import_asset_path.file_name().unwrap());

    if src_import_asset_path.is_dir() {
        fs::create_dir_all(&new_destination)?;

        copy_dir(src_import_asset_path, &new_destination)?;
    } else {
        copy_file(src_import_asset_path, &new_destination)?;
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
