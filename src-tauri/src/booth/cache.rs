use std::collections::HashMap;

use chrono::Local;

use crate::definitions::entities::{AssetDescription, AssetType};

const EXPIRATION_SECONDS: i64 = 60;

pub struct BoothCache {
    cache: HashMap<u64, (AssetDescription, Option<AssetType>, i64)>,
}

impl BoothCache {
    pub fn new() -> Self {
        Self {
            cache: HashMap::new(),
        }
    }

    pub fn get(&self, id: u64) -> Option<(AssetDescription, Option<AssetType>)> {
        let result = self.cache.get(&id);

        if result.is_none() {
            return None;
        }
        let result = result.unwrap();

        if result.2 < Local::now().timestamp() {
            return None;
        }

        Some((result.0.clone(), result.1.clone()))
    }

    pub fn insert(&mut self, id: u64, value: (AssetDescription, Option<AssetType>)) {
        self.cache.insert(
            id,
            (
                value.0,
                value.1,
                Local::now().timestamp() + EXPIRATION_SECONDS,
            ),
        );
    }
}
