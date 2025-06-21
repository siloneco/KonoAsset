use chrono::{DateTime, Duration, Local, NaiveDate, Utc};
use data_store::provider::StoreProvider;
use serde::Serialize;
use std::collections::HashMap;

#[derive(Debug, Serialize, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct AssetRegistrationStatistics {
    pub date: String,
    pub avatars: u64,
    pub avatar_wearables: u64,
    pub world_objects: u64,
    pub other_assets: u64,
}

pub async fn get_asset_registration_statistics(
    provider: &StoreProvider,
) -> Result<Vec<AssetRegistrationStatistics>, String> {
    let avatars = provider.get_avatar_store().get_all().await;
    let avatar_wearables = provider.get_avatar_wearable_store().get_all().await;
    let world_objects = provider.get_world_object_store().get_all().await;
    let other_assets = provider.get_other_asset_store().get_all().await;

    // Prepare assets for oldest date calculation
    let mut all_timestamps: Vec<(i64, usize)> = Vec::new();

    all_timestamps.extend(avatars.iter().map(|a| (a.description.created_at, 0)));
    all_timestamps.extend(
        avatar_wearables
            .iter()
            .map(|w| (w.description.created_at, 1)),
    );
    all_timestamps.extend(world_objects.iter().map(|o| (o.description.created_at, 2)));
    all_timestamps.extend(other_assets.iter().map(|o| (o.description.created_at, 3)));

    // Find the oldest date among all assets
    let oldest_date = find_oldest_date(&all_timestamps);

    let today = Local::now().date_naive();

    // Initialize date range
    let mut date_counts: HashMap<NaiveDate, (u64, u64, u64, u64)> = HashMap::new();
    let mut current_date = oldest_date;
    while current_date <= today {
        date_counts.insert(current_date, (0, 0, 0, 0));
        current_date = current_date + Duration::days(1);
    }

    // Count assets by date
    let mut count_assets = |timestamp: i64, asset_type: usize| {
        if let Some(date) = get_date_from_timestamp(timestamp) {
            let date = if date < oldest_date {
                oldest_date
            } else {
                date
            };

            let count = date_counts.entry(date).or_insert((0, 0, 0, 0));
            match asset_type {
                0 => count.0 += 1,
                1 => count.1 += 1,
                2 => count.2 += 1,
                3 => count.3 += 1,
                _ => unreachable!(),
            }
        }
    };

    // Count all assets
    for (timestamp, asset_type) in all_timestamps {
        count_assets(timestamp, asset_type);
    }

    // Convert to cumulative statistics
    let mut result: Vec<AssetRegistrationStatistics> = Vec::new();
    let mut cumulative_avatars = 0;
    let mut cumulative_wearables = 0;
    let mut cumulative_objects = 0;
    let mut cumulative_others = 0;

    let mut sorted_dates: Vec<_> = date_counts.keys().collect();
    sorted_dates.sort();

    for date in sorted_dates {
        let (avatars, wearables, objects, others) = date_counts[date];
        cumulative_avatars += avatars;
        cumulative_wearables += wearables;
        cumulative_objects += objects;
        cumulative_others += others;

        result.push(AssetRegistrationStatistics {
            date: date.format("%Y-%m-%d").to_string(),
            avatars: cumulative_avatars,
            avatar_wearables: cumulative_wearables,
            world_objects: cumulative_objects,
            other_assets: cumulative_others,
        });
    }

    Ok(result)
}

fn get_date_from_timestamp(timestamp: i64) -> Option<NaiveDate> {
    DateTime::<Utc>::from_timestamp_millis(timestamp).map(|dt| dt.date_naive())
}

fn find_oldest_date(assets: &[(i64, usize)]) -> NaiveDate {
    let today = Local::now().date_naive();
    let six_months_ago = today - Duration::days(180);

    assets
        .iter()
        .filter_map(|(timestamp, _)| get_date_from_timestamp(*timestamp))
        .filter(|&date| date >= six_months_ago)
        .min()
        .unwrap_or(today)
}
