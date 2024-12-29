use std::{path::PathBuf, process::Command};

pub fn open_in_file_manager(path: &PathBuf) -> Result<(), String> {
    if !path.exists() {
        return Err("File or directory does not exist".into());
    }

    if path.is_dir() {
        let result = opener::open(path);

        return match result {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        };
    } else {
        let result = open_file_with_selected(path);

        match result {
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string()),
        }
    }
}

#[cfg(target_os = "windows")]
fn open_file_with_selected(path: &PathBuf) -> Result<(), String> {
    use std::os::windows::process::CommandExt;

    let path_str = path.to_str().unwrap();
    let result = Command::new("explorer")
        .arg("/select,")
        .raw_arg(format!("\"{path_str}\""))
        .spawn();

    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[cfg(target_os = "macos")]
fn open_file_with_selected(path: &PathBuf) -> Result<(), String> {
    let result = Command::new("open").arg("-R").arg(path).spawn();

    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[cfg(target_os = "linux")]
fn open_file_with_selected(path: &PathBuf) -> Result<(), String> {
    let result = Command::new("nautilus").arg("--select").arg(path).spawn();

    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
