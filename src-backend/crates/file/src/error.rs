#[derive(Debug, thiserror::Error)]
pub enum ImageEncodeError {
    #[error("I/O error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("Image error: {0}")]
    ImageProcessError(#[from] image::ImageError),
}
