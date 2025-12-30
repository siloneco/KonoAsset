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
