use std::{
    collections::HashMap,
    fs::File,
    path::{Path, PathBuf},
    time::Instant,
};

use image::{DynamicImage, ImageDecoder, ImageFormat, ImageReader, codecs::webp::WebPEncoder};
use uuid::Uuid;

use crate::DeleteOnDrop;

pub fn resize_and_encode_with_webp<P, Q>(src: P, dest: Q) -> Result<(), String>
where
    P: AsRef<Path>,
    Q: AsRef<Path>,
{
    let now = Instant::now();

    let dest = dest.as_ref();

    let img = ImageReader::open(src)
        .map_err(|e| format!("Failed to open image: {}", e))?
        .with_guessed_format()
        .map_err(|e| format!("Failed to guess image format: {}", e))?;

    let mut decoder = img
        .into_decoder()
        .map_err(|e| format!("Failed to create decoder: {}", e))?;

    let orientation = decoder
        .orientation()
        .map_err(|e| format!("Failed to get orientation: {}", e))?;

    let mut image = DynamicImage::from_decoder(decoder)
        .map_err(|e| format!("Failed to create dynamic image: {}", e))?;

    image.apply_orientation(orientation);

    // 常に横幅を300ピクセル以下にする
    let image = image.thumbnail(300, 100000);

    let file = File::create(dest).map_err(|e| format!("Failed to create file: {}", e))?;
    let encoder = WebPEncoder::new_lossless(file);

    image
        .write_with_encoder(encoder)
        .map_err(|e| format!("Failed to write image: {}", e))?;

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
) -> Result<HashMap<PathBuf, PathBuf>, String> {
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

        let image = ImageReader::open(&path)
            .map_err(|e| format!("Failed to open image: {}", e))?
            .with_guessed_format()
            .map_err(|e| format!("Failed to guess image format: {}", e))?;

        let Some(format) = image.format() else {
            continue;
        };

        let (width, _) = image
            .into_dimensions()
            .map_err(|e| format!("Failed to get dimensions: {}", e))?;

        if format == ImageFormat::WebP && width <= 300 {
            continue;
        }

        let dest = path.with_file_name(format!("{}.webp", Uuid::new_v4().to_string()));

        if !dry_run {
            resize_and_encode_with_webp(&path, &dest)?;
            cleanups.push(DeleteOnDrop::new(dest.clone()));
        }

        result.insert(path, dest);
    }

    for mut cleanup in cleanups {
        cleanup.mark_as_completed();
    }

    Ok(result)
}
