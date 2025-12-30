use std::collections::HashMap;
use std::io::Write;
use std::path::{Path, PathBuf};

use file::DeleteOnDrop;

use crate::{PximgResolveError, PximgResolverValidationError};

use super::client::get_reqwest_client;

type ImageUrl = String;
type Filename = String;

pub struct PximgResolver {
    client: reqwest::Client,
    images_dir: PathBuf,
    file_map: HashMap<ImageUrl, Filename>,
}

impl PximgResolver {
    pub fn new<P, S>(images_dir: P, version: S) -> Self
    where
        P: AsRef<Path>,
        S: AsRef<str>,
    {
        Self {
            client: get_reqwest_client(version).expect("Failed to create reqwest client"),
            images_dir: images_dir.as_ref().to_path_buf(),
            file_map: HashMap::new(),
        }
    }

    pub async fn resolve(&mut self, url: &str) -> Result<String, PximgResolveError> {
        if let Some(filename) = self.file_map.get(url) {
            return Ok(filename.clone());
        }

        log::info!("Resolving image from URL: {}", url);

        let filename = format!("temp_{}.jpg", uuid::Uuid::new_v4());
        let original_path = self.images_dir.join(&filename);

        // 元のファイルはリサイズが終わったら自動で削除する
        let _cleanup = DeleteOnDrop::new(original_path.clone());

        save_image_from_url(&self.client, url, &original_path).await?;
        log::info!("Resolved and saved image to {}", original_path.display());

        let resized_filename = format!("temp_{}.jpg", uuid::Uuid::new_v4());
        let resized_path = self.images_dir.join(&resized_filename);

        file::resize_and_encode_with_jpeg(&original_path, &resized_path)?;

        self.file_map
            .insert(url.to_string(), resized_filename.clone());
        Ok(resized_filename)
    }

    pub fn change_images_dir<P>(&mut self, images_dir: P)
    where
        P: AsRef<Path>,
    {
        self.images_dir = images_dir.as_ref().to_path_buf();
    }
}

async fn save_image_from_url<P>(
    client: &reqwest::Client,
    url: &str,
    output: P,
) -> Result<(), PximgResolveError>
where
    P: AsRef<Path>,
{
    validate_url(url)?;

    if let Some(parent) = output.as_ref().parent() {
        tokio::fs::create_dir_all(parent).await?;
    }

    let mut file = std::fs::File::create(output)?;
    let bytes = client.get(url).send().await?.bytes().await?;

    file.write_all(bytes.as_ref())?;
    Ok(())
}

fn validate_url(url: &str) -> Result<(), PximgResolverValidationError> {
    let url = url
        .parse::<reqwest::Url>()
        .map_err(|e| PximgResolverValidationError::ParseError(e.to_string()))?;

    if url.scheme() != "https" {
        return Err(PximgResolverValidationError::InvalidScheme(
            url.scheme().to_string(),
        ));
    }

    let domain = url.domain();
    if domain != Some("booth.pximg.net") {
        return Err(PximgResolverValidationError::InvalidDomain(format!(
            "{:?}",
            domain
        )));
    }

    Ok(())
}
