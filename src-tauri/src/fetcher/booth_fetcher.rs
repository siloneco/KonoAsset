use chrono::Local;
use regex::Regex;
use serde::Deserialize;

use crate::definitions::entities::{AssetDescription, AssetType};

use super::common::get_reqwest_client;

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
    if !validate_booth_url(url) {
        return Err(format!("Invalid Booth URL specified: {}", url).into());
    }

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
        AssetDescription::create(title, author, image_src, vec![], Local::now().timestamp_millis()),
        estimated_asset_type,
    ))
}

pub fn validate_booth_url(url: &str) -> bool {
    let top_regex = Regex::new(r"^https://booth\.pm/[a-z-]{2,5}/items/[0-9]+$").unwrap();
    let shop_regex = Regex::new(r"^https://[0-9a-z-]+\.booth\.pm/items/[0-9]+$").unwrap();

    top_regex.is_match(url) || shop_regex.is_match(url)
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
        assert_eq!(validate_booth_url("https://booth.pm/zh-tw/items/123456"), true);

        // 正常系 ( <shop-name>.booth.pm )
        assert_eq!(validate_booth_url("https://shop.booth.pm/items/123456"), true);
        assert_eq!(validate_booth_url("https://shop-name-that-contains-hyphen.booth.pm/items/123456"), true);
        assert_eq!(validate_booth_url("https://shop-name-that-contains-number-12345.booth.pm/items/123456"), true);

        // 異常系: HTTP
        assert_eq!(validate_booth_url("http://booth.pm/ja/items/123456"), false);
        assert_eq!(validate_booth_url("http://shop.booth.pm/items/123456"), false);

        // 異常系: 商品IDが数字で構成されていない場合
        assert_eq!(validate_booth_url("https://booth.pm/ja/items/abc123"), false);
        assert_eq!(validate_booth_url("https://shop.booth.pm/items/abc123"), false);

        // 異常系: ショップのURLなのに言語指定がある場合
        assert_eq!(validate_booth_url("https://shop.booth.pm/ja/items/123456"), false);

        // 異常系: 不適切ドメイン
        assert_eq!(validate_booth_url("https://example.com/ja/items/123456"), false);
    }
}