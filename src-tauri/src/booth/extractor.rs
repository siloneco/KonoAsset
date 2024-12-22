pub fn extract_booth_item_id_from_booth_url(url: &str) -> Result<u64, String> {
    let shop_booth_url_capture_regex =
        regex::Regex::new(r"^https://[0-9a-z-]+\.booth\.pm\/items\/([0-9]+)$").unwrap();
    let default_booth_url_capture_regex =
        regex::Regex::new(r"^https://booth\.pm/[a-z-]{2,5}/items/([0-9]+)$").unwrap();

    if !shop_booth_url_capture_regex.is_match(url) && !default_booth_url_capture_regex.is_match(url)
    {
        return Err("Not a booth URL".to_string());
    }

    let shop_match = shop_booth_url_capture_regex.captures(url);
    if shop_match.is_some() {
        return Ok(shop_match.unwrap()[1].parse().unwrap());
    }

    let default_match = default_booth_url_capture_regex.captures(url);
    if default_match.is_some() {
        return Ok(default_match.unwrap()[1].parse().unwrap());
    }

    Err("Failed to parse booth URL".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_booth_item_id_from_booth_url() {
        // 正常系
        assert_eq!(
            extract_booth_item_id_from_booth_url("https://booth.pm/ja/items/123456").unwrap(),
            123456
        );
        assert_eq!(
            extract_booth_item_id_from_booth_url("https://shop.booth.pm/items/123456").unwrap(),
            123456
        );

        // 異常系
        assert_eq!(
            extract_booth_item_id_from_booth_url("https://booth.pm/ja/items/123456/").is_err(),
            true
        );
        assert_eq!(
            extract_booth_item_id_from_booth_url("https://shop.booth.pm/items/123456/").is_err(),
            true
        );
        assert_eq!(
            extract_booth_item_id_from_booth_url("https://example.com/123456").is_err(),
            true
        );
    }
}
