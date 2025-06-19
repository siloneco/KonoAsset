use super::common::BoothAssetInfo;
use chrono::Local;
use std::collections::HashMap;

const EXPIRATION_SECONDS: i64 = 60;

pub struct BoothCache {
    cache: HashMap<u64, (BoothAssetInfo, i64)>,
}

impl BoothCache {
    pub fn new() -> Self {
        Self {
            cache: HashMap::new(),
        }
    }

    pub fn get(&self, id: u64) -> Option<BoothAssetInfo> {
        let result = self.cache.get(&id)?;

        if result.1 < Local::now().timestamp() {
            return None;
        }

        Some(result.0.clone())
    }

    pub fn insert(&mut self, id: u64, value: BoothAssetInfo) {
        self.cache
            .insert(id, (value, Local::now().timestamp() + EXPIRATION_SECONDS));
    }
}

#[cfg(test)]
mod tests {
    use model::AssetType;

    use super::*;

    #[test]
    fn test_booth_cache() {
        let id = 12345;

        let asset_info = BoothAssetInfo {
            id,
            name: "Test Asset".to_string(),
            creator: "Test Creator".to_string(),
            estimated_asset_type: Some(AssetType::Avatar),
            image_urls: vec![],
            published_at: 12345,
        };

        let mut cache = BoothCache::new();
        cache.insert(id, asset_info.clone());

        assert_eq!(cache.get(id), Some(asset_info));
    }
}
