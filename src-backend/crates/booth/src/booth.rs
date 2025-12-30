use chrono::DateTime;
use model::AssetType;

use crate::{BoothInfoFetchError, definitions::BoothJsonSchema};

use super::{cache::BoothCache, client::get_reqwest_client, definitions::BoothAssetInfo};

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

    pub async fn fetch(&mut self, id: u64) -> Result<BoothAssetInfo, BoothInfoFetchError> {
        if let Some(cached_result) = self.cache.get(id) {
            return Ok(cached_result);
        }

        let url = construct_api_url(id);
        let response = self.reqwest_client.get(&url).send().await?;

        if response.status().as_u16() == 404 {
            return Err(BoothInfoFetchError::NotFound(id));
        }

        let body = response.text().await?;
        self.parse_response_and_process(&body)
    }

    fn parse_response_and_process(
        &mut self,
        body: &str,
    ) -> Result<BoothAssetInfo, BoothInfoFetchError> {
        let response: BoothJsonSchema = serde_json::from_str(body)?;

        let id = response.id;
        let image_urls: Vec<String> = response.images.into_iter().map(|i| i.original).collect();
        let published_at = DateTime::parse_from_rfc3339(&response.published_at)?.timestamp_millis();

        let estimated_asset_type = estimate_asset_type_from_category(response.category.id);

        let result = BoothAssetInfo {
            id,
            name: response.name,
            creator: response.shop.name,
            image_urls,
            published_at,
            estimated_asset_type,
        };

        self.cache.insert(id, result.clone());
        Ok(result)
    }
}

fn estimate_asset_type_from_category(category_id: i32) -> Option<AssetType> {
    match category_id {
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
    }
}

fn construct_api_url(id: u64) -> String {
    format!("https://booth.pm/ja/items/{}.json", id)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_response_and_process() {
        let mut fetcher = BoothFetcher::new("0.0.0+cargo-test");
        let body = include_str!("../test/6641548.json");

        let result = fetcher.parse_response_and_process(body).unwrap();

        assert_eq!(result.id, 6641548);
        assert_eq!(result.name, "KonoAsset - VRChat向けアセット管理ツール");
        assert_eq!(result.creator, "silolab");
        assert_eq!(
            result.image_urls,
            vec![
                "https://booth.pximg.net/7e5e7af4-bf80-4938-b27f-dbb516cd8461/i/6641548/aa2cd383-a6f9-41f6-a200-f7202533eb16_base_resized.jpg",
                "https://booth.pximg.net/7e5e7af4-bf80-4938-b27f-dbb516cd8461/i/6641548/77f4673c-3c0c-4d8f-9b5e-f0e4c818fd0b_base_resized.jpg",
                "https://booth.pximg.net/7e5e7af4-bf80-4938-b27f-dbb516cd8461/i/6641548/e53f11f9-3b3a-4ee5-b31a-8e323168a4de_base_resized.jpg",
                "https://booth.pximg.net/7e5e7af4-bf80-4938-b27f-dbb516cd8461/i/6641548/33274e61-3442-4afb-9169-c23410124696_base_resized.jpg",
                "https://booth.pximg.net/7e5e7af4-bf80-4938-b27f-dbb516cd8461/i/6641548/d377d14a-1356-4cba-bd3a-cc2ff1667b4a_base_resized.jpg",
                "https://booth.pximg.net/7e5e7af4-bf80-4938-b27f-dbb516cd8461/i/6641548/b53b0dc5-3508-4fb7-b402-3dcf163a2e49_base_resized.jpg",
                "https://booth.pximg.net/7e5e7af4-bf80-4938-b27f-dbb516cd8461/i/6641548/93aa4592-b2a6-4879-a2ce-08ba5079c974_base_resized.jpg",
                "https://booth.pximg.net/7e5e7af4-bf80-4938-b27f-dbb516cd8461/i/6641548/78858ed8-1294-4a5e-a9a1-2b57bc2d6f78_base_resized.jpg",
                "https://booth.pximg.net/7e5e7af4-bf80-4938-b27f-dbb516cd8461/i/6641548/18bb559e-38cd-4e1a-97f4-f0efdbf4b394_base_resized.jpg",
                "https://booth.pximg.net/7e5e7af4-bf80-4938-b27f-dbb516cd8461/i/6641548/d7572322-eb6c-41a1-bd63-0a571727100f_base_resized.jpg"
            ]
        );
        assert_eq!(result.published_at, 1740651821000);
        assert_eq!(result.estimated_asset_type, Some(AssetType::AvatarWearable));
    }

    #[test]
    fn test_estimate_asset_type() {
        // 3Dキャラクター
        assert_eq!(
            estimate_asset_type_from_category(208),
            Some(AssetType::Avatar)
        );

        // 3D衣装
        assert_eq!(
            estimate_asset_type_from_category(209),
            Some(AssetType::AvatarWearable)
        );

        // 3D環境・ワールド
        assert_eq!(
            estimate_asset_type_from_category(211),
            Some(AssetType::WorldObject)
        );

        // 不明なカテゴリ
        assert_eq!(estimate_asset_type_from_category(0), None);
    }

    #[test]
    fn test_construct_api_url() {
        assert_eq!(construct_api_url(0), "https://booth.pm/ja/items/0.json");
        assert_eq!(construct_api_url(1), "https://booth.pm/ja/items/1.json");
        assert_eq!(
            construct_api_url(1234567890),
            "https://booth.pm/ja/items/1234567890.json"
        );
    }
}
