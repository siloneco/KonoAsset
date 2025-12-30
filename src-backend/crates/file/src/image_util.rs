use std::{
    collections::HashMap,
    fs::File,
    path::{Path, PathBuf},
    time::Instant,
};

use image::{DynamicImage, ImageDecoder, ImageFormat, ImageReader, codecs::jpeg::JpegEncoder};
use uuid::Uuid;

use crate::{DeleteOnDrop, ImageEncodeError};

pub fn resize_and_encode_with_jpeg<P, Q>(src: P, dest: Q) -> Result<(), ImageEncodeError>
where
    P: AsRef<Path>,
    Q: AsRef<Path>,
{
    let now = Instant::now();

    let dest = dest.as_ref();

    let img = ImageReader::open(src)?.with_guessed_format()?;

    let mut decoder = img.into_decoder()?;
    let orientation = decoder.orientation()?;
    let mut image = DynamicImage::from_decoder(decoder)?;

    image.apply_orientation(orientation);

    // 常に横幅を300ピクセル以下にする
    let image = image.thumbnail(300, 100000);

    let file = File::create(dest)?;
    let encoder = JpegEncoder::new_with_quality(file, 95);

    image.write_with_encoder(encoder)?;

    log::info!(
        "Image resized and encoded in {}ms ({})",
        now.elapsed().as_millis(),
        dest.display(),
    );

    Ok(())
}

pub async fn optimize_thumbnails(
    images: Vec<PathBuf>,
    dry_run: bool,
    progress_callback: impl Fn(f32, String),
) -> Result<HashMap<PathBuf, PathBuf>, ImageEncodeError> {
    if images.is_empty() {
        return Ok(HashMap::new());
    }

    let mut result = HashMap::new();

    let mut cleanups = vec![];
    let amount_of_images = images.len();

    for (index, path) in images.into_iter().enumerate() {
        let filename = match path.file_name() {
            Some(filename) => filename.to_string_lossy().to_string(),
            None => String::new(),
        };

        let progress = index as f32 / amount_of_images as f32;
        progress_callback(progress, filename);

        let image = ImageReader::open(&path)?.with_guessed_format()?;
        let Some(format) = image.format() else {
            continue;
        };

        let (width, _) = image.into_dimensions()?;
        if format == ImageFormat::Jpeg && width <= 300 {
            continue;
        }

        let dest = path.with_file_name(format!("{}.jpg", Uuid::new_v4().to_string()));

        if !dry_run {
            cleanups.push(DeleteOnDrop::new(dest.clone()));
            resize_and_encode_with_jpeg(&path, &dest)?;
        }

        result.insert(path, dest);
    }

    for mut cleanup in cleanups {
        cleanup.mark_as_completed();
    }

    Ok(result)
}

#[cfg(test)]
mod tests {
    use std::sync::{Arc, Mutex};

    use super::*;

    #[test]
    fn test_resize_and_encode_with_jpeg() {
        let temp_dir = PathBuf::from("test/temp/resize_and_encode_with_jpeg/");

        if std::fs::exists(&temp_dir).unwrap() {
            std::fs::remove_dir_all(&temp_dir).unwrap();
        }
        std::fs::create_dir_all(&temp_dir).unwrap();

        let src_bytes = include_bytes!("../../../test/images/thumbnail.jpg");

        let src_path = temp_dir.join("src.jpg");
        let dest_path = temp_dir.join("dest.jpg");

        std::fs::write(&src_path, src_bytes).unwrap();

        resize_and_encode_with_jpeg(&src_path, &dest_path).unwrap();

        assert!(std::fs::exists(&src_path).unwrap());
        assert!(std::fs::exists(&dest_path).unwrap());

        let dest_file_size = dest_path.metadata().unwrap().len();
        let size_100kb = 1024 * 100;

        // サイズが 0KB より大きく、100KB 未満であることを確認
        assert!(dest_file_size > 0);
        assert!(dest_file_size < size_100kb);
    }

    #[tokio::test]
    async fn test_optimize_thumbnails() {
        let temp_dir = PathBuf::from("test/temp/optimize_thumbnails/");

        if std::fs::exists(&temp_dir).unwrap() {
            std::fs::remove_dir_all(&temp_dir).unwrap();
        }
        std::fs::create_dir_all(&temp_dir).unwrap();

        let thumbnail1_bytes = include_bytes!("../../../test/images/thumbnail.jpg");
        let thumbnail2_bytes = include_bytes!("../../../test/images/description-image.jpg");

        std::fs::write(&temp_dir.join("thumbnail1.jpg"), thumbnail1_bytes).unwrap();
        std::fs::write(&temp_dir.join("thumbnail2.jpg"), thumbnail2_bytes).unwrap();

        let images = vec![
            temp_dir.join("thumbnail1.jpg"),
            temp_dir.join("thumbnail2.jpg"),
        ];

        let progress_recorder = Arc::new(Mutex::new(vec![]));

        let result = optimize_thumbnails(images, false, |progress, filename| {
            let mut progress_recorder = progress_recorder.lock().unwrap();
            progress_recorder.push((progress, filename));
        })
        .await
        .unwrap();

        assert_eq!(result.len(), 2);

        for (from, to) in result.iter() {
            assert!(from.exists());
            assert!(to.exists());

            let from_filename = from.file_name().unwrap().to_string_lossy().to_string();

            assert_eq!(from_filename.len(), "thumbnail1.jpg".len());
            assert!(from_filename.starts_with("thumbnail"));
            assert!(from_filename.ends_with(".jpg"));

            let to_filename = to.file_name().unwrap().to_string_lossy().to_string();

            assert_eq!(to_filename.len(), 40); // UUIDv4 + ".jpg" の長さ = 36 + 4 = 40
            assert!(to_filename.ends_with(".jpg"));
        }
    }
}
