use std::path::PathBuf;

use chrono::{DateTime, Local};
use serde::Deserialize;
use uuid::Uuid;

use crate::definitions::entities::{AssetDescription, AssetType};

use super::{cache::BoothCache, common::get_reqwest_client, image_saver::save_image_from_url};

pub struct BoothFetcher {
    cache: BoothCache,
}

impl BoothFetcher {
    pub fn new() -> Self {
        BoothFetcher {
            cache: BoothCache::new(),
        }
    }

    pub async fn fetch(
        &mut self,
        id: u64,
        images_dir: PathBuf,
    ) -> Result<(AssetDescription, Option<AssetType>), Box<dyn std::error::Error>> {
        let cache_result = self.cache.get(id);
        if let Some(cached_result) = cache_result {
            return Ok(cached_result);
        }

        let url = format!("https://booth.pm/ja/items/{}.json", id);
        let response: BoothJson = get_reqwest_client().get(&url).send().await?.json().await?;

        let title = response.name;
        let author = response.shop.name;
        let image_src = response.images.first().unwrap().original.clone();
        let published_at = DateTime::parse_from_rfc3339(&response.published_at)
            .unwrap()
            .timestamp_millis();

        let mut path = images_dir;
        path.push(format!("temp_{}.jpg", Uuid::new_v4().to_string()));

        let result = save_image_from_url(&image_src, &path).await;
        if result.is_err() {
            return Err(result.err().unwrap());
        }

        let image_src = Some(path.to_str().unwrap().to_string());

        let estimated_asset_type = match response.category.id {
            208 //   3Dキャラクター
            => Some(AssetType::Avatar),
            209 | // 3D衣装
            217 | // 3D装飾品
            210 | // 3D小道具
            214 | // 3Dテクスチャ
            215 | // 3Dツール・システム
            216 | // 3Dモーション・アニメーション
            127 //   3Dモデル（その他）
            => Some(AssetType::AvatarRelated),
            211 //   3D環境・ワールド
            => Some(AssetType::World),
            _ => None,
        };

        let result = (
            AssetDescription::create(
                title,
                author,
                image_src,
                vec![],
                Some(id),
                Local::now().timestamp_millis(),
                Some(published_at),
            ),
            estimated_asset_type,
        );

        self.cache.insert(id, result.clone());
        Ok(result)
    }
}

#[derive(Deserialize)]
struct BoothJson {
    name: String,
    shop: BoothShop,
    images: Vec<BoothPximg>,
    category: BoothCategory,
    published_at: String,
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
