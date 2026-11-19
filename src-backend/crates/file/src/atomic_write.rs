use std::{
    fs::File,
    io::{self, BufWriter, Write},
    path::{Path, PathBuf},
};

/// `path` の隣の `.tmp` に書き込んでから rename で置き換える。
/// 書き込み途中で失敗しても、元のファイルは壊れない。
pub fn write_atomic(
    path: &Path,
    write: impl FnOnce(&mut BufWriter<File>) -> io::Result<()>,
) -> io::Result<()> {
    let mut tmp = path.as_os_str().to_owned();
    tmp.push(".tmp");
    let tmp = PathBuf::from(tmp);

    let result = (|| {
        let mut writer = BufWriter::new(File::create(&tmp)?);
        write(&mut writer)?;
        writer.flush()?;
        // 電源断でも rename 後に空ファイルが残らないよう、rename 前にディスクへ書き切る
        writer.get_ref().sync_all()?;
        std::fs::rename(&tmp, path)
    })();

    if result.is_err() {
        let _ = std::fs::remove_file(&tmp);
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_write_atomic_keeps_original_on_failure() {
        let dir = std::env::temp_dir().join("konoasset_write_atomic_test");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("data.json");

        write_atomic(&path, |w| w.write_all(b"old")).unwrap();
        assert_eq!(std::fs::read(&path).unwrap(), b"old");

        let result = write_atomic(&path, |w| {
            w.write_all(b"partial")?;
            Err(io::Error::other("boom"))
        });
        assert!(result.is_err());
        assert_eq!(std::fs::read(&path).unwrap(), b"old");
        assert!(!dir.join("data.json.tmp").exists());

        write_atomic(&path, |w| w.write_all(b"new")).unwrap();
        assert_eq!(std::fs::read(&path).unwrap(), b"new");

        std::fs::remove_dir_all(&dir).unwrap();
    }
}
