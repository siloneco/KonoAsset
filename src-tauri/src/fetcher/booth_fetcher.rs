use std::path::PathBuf;

use chrono::{DateTime, Local};
use regex::Regex;
use serde::Deserialize;
use uuid::Uuid;

use crate::definitions::entities::{AssetDescription, AssetType};

use super::{common::get_reqwest_client, image_saver::save_image_from_url};

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

pub fn fetch_asset_details_from_booth(
    url: &str,
    images_dir: PathBuf,
) -> Result<(AssetDescription, Option<AssetType>), Box<dyn std::error::Error>> {
    if !validate_booth_url(url) {
        return Err(format!("Invalid Booth URL specified: {}", url).into());
    }

    let normalized_url = normalize_shop_booth_url_into_basic_url(&url);

    let url = format!("{}.json", normalized_url);
    let response: BoothJson = get_reqwest_client().get(&url).send()?.json()?;

    let title = response.name;
    let author = response.shop.name;
    let image_src = response.images.first().unwrap().original.clone();
    let published_at = DateTime::parse_from_rfc3339(&response.published_at)
        .unwrap()
        .timestamp_millis();

    let mut path = images_dir;
    path.push(format!("temp_{}.jpg", Uuid::new_v4().to_string()));

    let result = save_image_from_url(&image_src, &path);
    if result.is_err() {
        return Err(result.err().unwrap());
    }

    let image_src = path.to_str().unwrap().to_string();

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
        AssetDescription::create(
            title,
            author,
            image_src,
            vec![],
            Some(normalized_url),
            Local::now().timestamp_millis(),
            Some(published_at),
        ),
        estimated_asset_type,
    ))
}

pub fn validate_booth_url(url: &str) -> bool {
    let top_regex = Regex::new(r"^https://booth\.pm/[a-z-]{2,5}/items/[0-9]+$").unwrap();
    let shop_regex = Regex::new(r"^https://[0-9a-z-]+\.booth\.pm/items/[0-9]+$").unwrap();

    top_regex.is_match(url) || shop_regex.is_match(url)
}

pub fn normalize_shop_booth_url_into_basic_url(url: &str) -> String {
    let shop_regex = Regex::new(r"^https://[0-9a-z-]+\.booth\.pm/items/[0-9]+$").unwrap();

    if !shop_regex.is_match(url) {
        return url.into();
    }

    let item_id = url.split("/").last().unwrap();
    format!("https://booth.pm/ja/items/{}", item_id)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_booth_url() {
        // 正常系 ( booth.pm )
        assert_eq!(validate_booth_url("https://booth.pm/ja/items/123456"), true);
        assert_eq!(validate_booth_url("https://booth.pm/ja/items/123456"), true);
        assert_eq!(validate_booth_url("https://booth.pm/en/items/123456"), true);
        assert_eq!(
            validate_booth_url("https://booth.pm/zh-tw/items/123456"),
            true
        );

        // 正常系 ( <shop-name>.booth.pm )
        assert_eq!(
            validate_booth_url("https://shop.booth.pm/items/123456"),
            true
        );
        assert_eq!(
            validate_booth_url("https://shop-name-that-contains-hyphen.booth.pm/items/123456"),
            true
        );
        assert_eq!(
            validate_booth_url(
                "https://shop-name-that-contains-number-12345.booth.pm/items/123456"
            ),
            true
        );

        // 異常系: HTTP
        assert_eq!(validate_booth_url("http://booth.pm/ja/items/123456"), false);
        assert_eq!(
            validate_booth_url("http://shop.booth.pm/items/123456"),
            false
        );

        // 異常系: 商品IDが数字で構成されていない場合
        assert_eq!(
            validate_booth_url("https://booth.pm/ja/items/abc123"),
            false
        );
        assert_eq!(
            validate_booth_url("https://shop.booth.pm/items/abc123"),
            false
        );

        // 異常系: ショップのURLなのに言語指定がある場合
        assert_eq!(
            validate_booth_url("https://shop.booth.pm/ja/items/123456"),
            false
        );

        // 異常系: 不適切ドメイン
        assert_eq!(
            validate_booth_url("https://example.com/ja/items/123456"),
            false
        );
    }

    #[test]
    fn test_normalize_url_into_basic_url() {
        // booth.pm
        assert_eq!(
            normalize_shop_booth_url_into_basic_url("https://booth.pm/ja/items/123456"),
            "https://booth.pm/ja/items/123456"
        );

        // <shop-name>.booth.pm
        assert_eq!(
            normalize_shop_booth_url_into_basic_url("https://shop.booth.pm/items/123456"),
            "https://booth.pm/ja/items/123456"
        );
        assert_eq!(
            normalize_shop_booth_url_into_basic_url(
                "https://shop-name-that-contains-hyphen.booth.pm/items/123456"
            ),
            "https://booth.pm/ja/items/123456"
        );
        assert_eq!(
            normalize_shop_booth_url_into_basic_url(
                "https://shop-name-that-contains-number-12345.booth.pm/items/123456"
            ),
            "https://booth.pm/ja/items/123456"
        );
    }
}
