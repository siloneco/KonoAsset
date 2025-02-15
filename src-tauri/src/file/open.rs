use std::path::Path;

pub fn open_in_file_manager<P>(path: P) -> Result<(), String>
where
    P: AsRef<Path>,
{
    let path = path.as_ref();

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
        showfile::show_path_in_file_manager(path);
        return Ok(());
    }
}
