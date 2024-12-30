use std::path::PathBuf;

use chrono::DateTime;
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
        let response = get_reqwest_client().get(&url).send().await?;

        if response.status().as_u16() == 404 {
            return Err("商品が見つかりませんでした".into());
        }

        let response: BoothJsonSchema = response.json().await?;

        let name = response.name;
        let creator = response.shop.name;
        let image_url = if let Some(item) = response.images.first() {
            Some(item.original.clone())
        } else {
            None
        };
        let published_at = DateTime::parse_from_rfc3339(&response.published_at)
            .unwrap()
            .timestamp_millis();

        let mut path = images_dir;
        path.push(format!("temp_{}.jpg", Uuid::new_v4().to_string()));

        let image_path = if let Some(image_url) = image_url {
            let result = save_image_from_url(&image_url, &path).await;
            if result.is_err() {
                return Err(result.err().unwrap());
            }

            Some(path.to_str().unwrap().to_string())
        } else {
            None
        };

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
            => Some(AssetType::AvatarWearable),
            211 //   3D環境・ワールド
            => Some(AssetType::WorldObject),
            _ => None,
        };

        let result = (
            AssetDescription::create(
                name,
                creator,
                image_path,
                vec![],
                Some(id),
                0,
                Some(published_at),
            ),
            estimated_asset_type,
        );

        self.cache.insert(id, result.clone());
        Ok(result)
    }
}

#[derive(Deserialize)]
struct BoothJsonSchema {
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
