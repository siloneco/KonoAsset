use std::time::Duration;

use chrono::Local;
use serde::Deserialize;

use crate::definitions::entities::{AssetDescription, AssetType};

#[derive(Deserialize)]
struct BoothJson {
    name: String,
    shop: BoothShop,
    images: Vec<BoothPximg>,
    category: BoothCategory,
}

#[derive(Deserialize)]
struct BoothShop {
    name: String,
}

#[derive(Deserialize)]
struct BoothPximg {
    original: String,
}

#[derive(Deserialize)]
struct BoothCategory {
    id: i32,
}

pub fn fetch_asset_details_from_booth(
    url: &str,
) -> Result<(AssetDescription, Option<AssetType>), Box<dyn std::error::Error>> {
    let url = format!("{}.json", url);
    let response: BoothJson = get_reqwest_client().get(url).send()?.json()?;

    let title = response.name;
    let author = response.shop.name;
    let image_src = response.images.first().unwrap().original.clone();

    let estimated_asset_type = match response.category.id {
        208 // 3Dキャラクター
        => Some(AssetType::Avatar),

        209 | // 3D衣装
        217 | // 3D装飾品
        210 | // 3D小道具
        214 | // 3Dテクスチャ
        215 | // 3Dツール・システム
        216 | // 3Dモーション・アニメーション
        127 // 3Dモデル（その他）
        => Some(AssetType::AvatarRelated),

        211  // 3D環境・ワールド
        => Some(AssetType::World),
        
        _ => None,
    };

    Ok((
        AssetDescription::create(title, author, image_src, vec![], Local::now()),
        estimated_asset_type,
    ))
}

fn get_reqwest_client() -> reqwest::blocking::Client {
    reqwest::blocking::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")
        .timeout(Duration::from_secs(5))
        .build()
        .unwrap()
}
