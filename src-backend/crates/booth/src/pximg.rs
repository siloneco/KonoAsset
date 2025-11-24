use std::collections::HashMap;
use std::io::Write;
use std::path::{Path, PathBuf};

use file::DeleteOnDrop;

use super::common::get_reqwest_client;

pub struct PximgResolver {
    client: reqwest::Client,
    images_dir: PathBuf,

    // key: image url, value: file name
    file_map: HashMap<String, String>,
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

    pub async fn resolve(&mut self, url: &str) -> Result<String, String> {
        if let Some(filename) = self.file_map.get(url) {
            return Ok(filename.clone());
        }

        log::info!("Resolving image from URL: {}", url);

        let filename = format!("temp_{}.jpg", uuid::Uuid::new_v4());
        let jpg_path = self.images_dir.join(&filename);

        // jpg は WebP エンコードが終わったら自動で削除する
        let _cleanup = DeleteOnDrop::new(jpg_path.clone());

        let result = save_image_from_url(&self.client, url, &jpg_path).await;

        if let Err(e) = result {
            let err = format!("Failed to resolve image from URL: {}", e);
            log::error!("{err}");
            return Err(err);
        }

        log::info!(
            "Resolved image from URL and saved to {}",
            jpg_path.display()
        );

        let webp_filename = format!("temp_{}.webp", uuid::Uuid::new_v4());
        let webp_path = self.images_dir.join(&webp_filename);

        file::resize_and_encode_with_webp(&jpg_path, &webp_path)?;

        self.file_map.insert(url.to_string(), webp_filename.clone());
        Ok(webp_filename)
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
