use super::definitions::BoothAssetInfo;
use chrono::Local;
use std::collections::HashMap;

const EXPIRATION_SECONDS: i64 = 60;

type CacheExpirationTimestamp = i64;

pub struct BoothCache {
    cache: HashMap<u32, (BoothAssetInfo, CacheExpirationTimestamp)>,
}

impl BoothCache {
    pub fn new() -> Self {
        Self {
            cache: HashMap::new(),
        }
    }

    pub fn get(&self, id: u32) -> Option<BoothAssetInfo> {
        let result = self.cache.get(&id)?;

        if result.1 < Local::now().timestamp() {
            return None;
        }

        Some(result.0.clone())
    }

    pub fn insert(&mut self, id: u32, value: BoothAssetInfo) {
        self.cache
            .insert(id, (value, Local::now().timestamp() + EXPIRATION_SECONDS));
    }
}

#[cfg(test)]
mod tests {
    use model::AssetType;

    use super::*;

    fn get_example_asset_info() -> BoothAssetInfo {
        BoothAssetInfo {
            id: 12345,
            name: "Test Asset".to_string(),
            creator: "Test Creator".to_string(),
            estimated_asset_type: Some(AssetType::Avatar),
            image_urls: vec![],
            published_at: 12345,
        }
    }

    #[test]
    fn test_cache_hit() {
        let id = 12345;
        let asset_info = get_example_asset_info();

        let mut cache = BoothCache::new();
        cache.insert(id, asset_info.clone());

        assert_eq!(cache.get(id), Some(asset_info));
    }

    #[test]
    fn test_cache_miss() {
        let id = 12345;
        let cache = BoothCache::new();

        assert_eq!(cache.get(id), None);
    }

    #[test]
    fn test_cache_expired() {
        let id = 12345;
        let asset_info = get_example_asset_info();

        let mut cache = BoothCache::new();

        cache
            .cache
            .insert(id, (asset_info, Local::now().timestamp() - 1));

        assert_eq!(cache.get(id), None);
    }
}
