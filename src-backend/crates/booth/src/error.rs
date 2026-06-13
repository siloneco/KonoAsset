#[derive(Debug, thiserror::Error)]
pub enum BoothInfoFetchError {
    #[error("Item not found with ID: {0}")]
    NotFound(u64),
    #[error("Failed to fetch asset description from BOOTH: {0}")]
    APICallError(#[from] reqwest::Error),
    #[error("Failed to parse JSON from BOOTH API response: {0}")]
    JSONParseError(#[from] serde_json::Error),
    #[error("Failed to parse date from BOOTH API response: {0}")]
    DateParseError(#[from] chrono::format::ParseError),
}

#[derive(Debug, thiserror::Error)]
pub enum PximgResolveError {
    #[error("URL Validation failed: {0}")]
    ValidationFailed(#[from] PximgResolverValidationError),
    #[error("I/O error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("Failed to fetch image from URL: {0}")]
    RequestError(#[from] reqwest::Error),
    #[error("Failed to encode image: {0}")]
    EncodeError(#[from] file::ImageEncodeError),
}

#[derive(Debug, thiserror::Error)]
pub enum PximgResolverValidationError {
    #[error("Failed to parse URL: {0}")]
    ParseError(String),
    #[error("Invalid scheme: {0}")]
    InvalidScheme(String),
    #[error("Invalid domain: {0}")]
    InvalidDomain(String),
}
