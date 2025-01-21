use std::fs::File;
use std::io::Write;
use std::path::PathBuf;

use super::common::get_reqwest_client;

pub async fn save_image_from_url(
    url: &str,
    output: &PathBuf,
) -> Result<(), Box<dyn std::error::Error>> {
    validate_url(url)?;

    let mut parent = output.clone();
    parent.pop();
    std::fs::create_dir_all(parent)?;

    let mut file = File::create(output)?;
    let client = get_reqwest_client().map_err(|e| format!("Unable to get http client: {}", e))?;
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
