use std::collections::HashMap;
use std::io::Write;
use std::path::{Path, PathBuf};

use file::DeleteOnDrop;
use reqwest::Client;

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

    pub fn change_images_dir<P>(&mut self, images_dir: P)
    where
        P: AsRef<Path>,
    {
        self.images_dir = images_dir.as_ref().to_path_buf();
    }

    pub async fn resolve(&mut self, url: &str) -> Result<String, PximgResolveError> {
        if let Some(filename) = self.file_map.get(url) {
            return Ok(filename.clone());
        }

        log::info!("Resolving image from URL: {}", url);

        let bytes = fetch_image(&self.client, url).await?;
        self.encode_and_save_image(&bytes, url.to_string()).await
    }

    async fn encode_and_save_image(
        &mut self,
        bytes: &[u8],
        string_url: String,
    ) -> Result<String, PximgResolveError> {
        let filename = format!("temp_{}.jpg", uuid::Uuid::new_v4());
        let original_path = self.images_dir.join(&filename);

        // 元のファイルはリサイズが終わったら自動で削除する
        let _cleanup = DeleteOnDrop::new(original_path.clone());

        {
            if let Some(parent) = original_path.parent() {
                tokio::fs::create_dir_all(parent).await?;
            }

            let mut file = std::fs::File::create(&original_path)?;
            file.write(&bytes)?;
            file.flush()?;
        }

        log::info!("Resolved and saved image to {}", original_path.display());

        let resized_filename = format!("temp_{}.jpg", uuid::Uuid::new_v4());
        let resized_path = self.images_dir.join(&resized_filename);

        file::resize_and_encode_with_jpeg(&original_path, &resized_path)?;

        self.file_map.insert(string_url, resized_filename.clone());
        Ok(resized_filename)
    }
}

async fn fetch_image(client: &Client, url: &str) -> Result<Vec<u8>, PximgResolveError> {
    validate_url(url)?;

    let bytes = client.get(url).send().await?.bytes().await?;
    Ok(bytes.to_vec())
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

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_encode_and_save_image() {
        let temp_dir = PathBuf::from("test/temp/pximg-encode-test/");

        if std::fs::exists(&temp_dir).unwrap() {
            std::fs::remove_dir_all(&temp_dir).unwrap();
        }
        std::fs::create_dir_all(&temp_dir).unwrap();

        let mut resolver = PximgResolver::new(temp_dir.clone(), "0.0.0+cargo-test");

        let bytes = include_bytes!("../../../test/images/thumbnail.jpg");
        let string_url = "https://dummy.konoasset.dev/dummy-path.jpg";

        let filename = resolver
            .encode_and_save_image(bytes, string_url.into())
            .await
            .unwrap();

        let encoded_image_path = temp_dir.join(&filename);

        // エンコードしたファイルがあることを確認
        assert!(std::fs::exists(&encoded_image_path).unwrap());
        // オリジナルファイルが削除されていることを確認
        assert_eq!(std::fs::read_dir(&temp_dir).unwrap().count(), 1);

        let file_size = encoded_image_path.metadata().unwrap().len();
        let size_100kb = 1024 * 100;

        // サイズが 0KB より大きく、100KB 未満であることを確認
        assert!(file_size > 0);
        assert!(file_size < size_100kb);
    }

    #[tokio::test]
    async fn test_encode_and_save_invalid_image() {
        let temp_dir = PathBuf::from("test/temp/pximg-invalid-encode-test/");

        if std::fs::exists(&temp_dir).unwrap() {
            std::fs::remove_dir_all(&temp_dir).unwrap();
        }
        std::fs::create_dir_all(&temp_dir).unwrap();

        let mut resolver = PximgResolver::new(temp_dir.clone(), "0.0.0+cargo-test");

        let bytes = b"";
        let string_url = "https://dummy.konoasset.dev/dummy-path.jpg";

        let result = resolver
            .encode_and_save_image(bytes, string_url.into())
            .await;

        matches!(result, Err(PximgResolveError::EncodeError(_)));
    }

    #[test]
    fn test_validate_url() {
        // 適切
        matches!(
            validate_url("https://booth.pximg.net/dummy-path.jpg"),
            Ok(())
        );
        matches!(
            validate_url("https://booth.pximg.net/path1/path2/something.png"),
            Ok(())
        );

        // ドメインが不適
        matches!(
            validate_url("https://dummy.konoasset.dev/dummy-path.jpg"),
            Err(PximgResolverValidationError::InvalidDomain(_))
        );
        matches!(
            validate_url("https://i.pximg.net/dummy-path.jpg"),
            Err(PximgResolverValidationError::InvalidDomain(_))
        );
        matches!(
            validate_url("https://pximg.net/path1/path2/dummy-path.png"),
            Err(PximgResolverValidationError::InvalidDomain(_))
        );

        // プロトコルが不適
        matches!(
            validate_url("http://booth.pximg.net/dummy-path.jpg"),
            Err(PximgResolverValidationError::InvalidScheme(_))
        );
        matches!(
            validate_url("ftp://booth.pximg.net/dummy-path.jpg"),
            Err(PximgResolverValidationError::InvalidScheme(_))
        );
        matches!(
            validate_url("file://dummy.konoasset.dev/dummy-path.jpg"),
            Err(PximgResolverValidationError::InvalidScheme(_))
        );
    }
}
