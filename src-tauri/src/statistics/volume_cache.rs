use super::AssetVolumeStatistics;

pub const ASSET_VOLUME_CACHE_EXPIRE_MS: u128 = 60 * 1000;

pub struct AssetVolumeStatisticsCache {
    cache: Option<(Vec<AssetVolumeStatistics>, u128)>,
}

impl AssetVolumeStatisticsCache {
    pub fn new() -> Self {
        Self { cache: None }
    }

    pub fn set_cache(&mut self, cache: Vec<AssetVolumeStatistics>) {
        let millis = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis();

        self.cache = Some((cache, millis));
    }

    pub fn get(&self) -> Option<&Vec<AssetVolumeStatistics>> {
        let (cache, last_updated) = self.cache.as_ref()?;

        let current_time = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis();

        if current_time - last_updated < ASSET_VOLUME_CACHE_EXPIRE_MS {
            Some(cache)
        } else {
            None
        }
    }
}
