use std::collections::HashMap;
use std::io::Write;
use std::path::{Path, PathBuf};

use super::common::get_reqwest_client;

pub struct PximgResolver {
    client: reqwest::Client,
    images_dir: PathBuf,

    // key: image url, value: file name
    file_map: HashMap<String, String>,
}

impl PximgResolver {
    pub fn new<P>(images_dir: P) -> Self
    where
        P: AsRef<Path>,
    {
        Self {
            client: get_reqwest_client().expect("Failed to create reqwest client"),
            images_dir: images_dir.as_ref().to_path_buf(),
            file_map: HashMap::new(),
        }
    }

    pub async fn resolve(&mut self, url: &str) -> Result<String, Box<dyn std::error::Error>> {
        if let Some(filename) = self.file_map.get(url) {
            return Ok(filename.clone());
        }

        log::info!("Resolving image from URL: {}", url);

        let filename = format!("temp_{}.jpg", uuid::Uuid::new_v4());
        let path = self.images_dir.join(&filename);

        let result = save_image_from_url(&self.client, url, &path).await;

        if let Err(e) = result {
            log::error!("Failed to resolve image from URL: {}", e);
            return Err(e);
        }

        log::info!("Resolved image from URL and saved to {}", path.display());

        self.file_map.insert(url.to_string(), filename.clone());
        Ok(filename)
    }
}

async fn save_image_from_url<P>(
    client: &reqwest::Client,
    url: &str,
    output: P,
) -> Result<(), Box<dyn std::error::Error>>
where
    P: AsRef<Path>,
{
    validate_url(url)?;

    if let Some(parent) = output.as_ref().parent() {
        tokio::fs::create_dir_all(parent).await?;
    }

    let mut file = std::fs::File::create(output)?;
    let bytes = client.get(url).send().await?.bytes().await?;

    file.write_all(bytes.as_ref())
        .map_err(|e| format!("Failed to write image to file: {}", e))?;
    Ok(())
}

fn validate_url(url: &str) -> Result<(), Box<dyn std::error::Error>> {
    let url = url.parse::<reqwest::Url>()?;

    if url.scheme() != "https" {
        return Err(format!("Invalid URL: Scheme must be HTTPS but got {}", url.scheme()).into());
    }

    if url.domain() != Some("booth.pximg.net") {
        return Err("Invalid URL: Domain must be booth.pximg.net".into());
    }

    Ok(())
}
