use chrono::DateTime;
use model::AssetType;
use serde::Deserialize;

use super::{
    cache::BoothCache,
    common::{BoothAssetInfo, get_reqwest_client},
};

pub struct BoothFetcher {
    cache: BoothCache,
    reqwest_client: reqwest::Client,
}

impl BoothFetcher {
    pub fn new<S: AsRef<str>>(version: S) -> Self {
        let reqwest_client = get_reqwest_client(version).expect("Failed to create reqwest client");

        BoothFetcher {
            cache: BoothCache::new(),
            reqwest_client,
        }
    }

    pub async fn fetch(&mut self, id: u64) -> Result<BoothAssetInfo, Box<dyn std::error::Error>> {
        if let Some(cached_result) = (&self.cache).get(id) {
            return Ok(cached_result);
        }

        let url = format!("https://booth.pm/ja/items/{}.json", id);
        let response = self.reqwest_client.get(&url).send().await?;

        if response.status().as_u16() == 404 {
            return Err("商品が見つかりませんでした".into());
        }

        let response: BoothJsonSchema = response.json().await?;

        let name = response.name;
        let creator = response.shop.name;
        let image_urls: Vec<String> = response.images.into_iter().map(|i| i.original).collect();
        let published_at = DateTime::parse_from_rfc3339(&response.published_at)?.timestamp_millis();

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

        let result = BoothAssetInfo::new(
            id,
            name,
            creator,
            image_urls,
            published_at,
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
