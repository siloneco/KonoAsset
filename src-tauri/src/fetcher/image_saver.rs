use std::fs::{self, File};
use std::path::PathBuf;

use super::common::get_reqwest_client;

pub fn save_image_from_url(url: &str, output: &PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    validate_url(url)?;

    let mut parent = output.clone();
    parent.pop();
    fs::create_dir_all(parent)?;

    let mut file = File::create(output).unwrap();
    get_reqwest_client().get(url).send()?.copy_to(&mut file)?;

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
