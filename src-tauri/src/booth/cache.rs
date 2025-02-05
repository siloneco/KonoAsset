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
