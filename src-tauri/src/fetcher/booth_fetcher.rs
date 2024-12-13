use std::time::Duration;

use chrono::Local;
use serde::Deserialize;

use crate::definitions::entities::AssetDescription;

#[derive(Deserialize)]
struct BoothJson {
    name: String,
    shop: BoothShop,
    images: Vec<BoothPximg>,
}

#[derive(Deserialize)]
struct BoothShop {
    name: String,
}

#[derive(Deserialize)]
struct BoothPximg {
    original: String,
}

pub fn fetch_asset_as_asset_description(
    url: &str,
) -> Result<AssetDescription, Box<dyn std::error::Error>> {
    let url = format!("{}.json", url);
    let response: BoothJson = get_reqwest_client().get(url).send()?.json()?;

    let title = response.name;
    let author = response.shop.name;
    let image_src = response.images.first().unwrap().original.clone();

    Ok(AssetDescription::create(
        title,
        author,
        image_src,
        vec![],
        Local::now(),
    ))
}

fn get_reqwest_client() -> reqwest::blocking::Client {
    reqwest::blocking::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")
        .timeout(Duration::from_secs(5))
        .build()
        .unwrap()
}
