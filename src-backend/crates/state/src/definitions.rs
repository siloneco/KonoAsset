use model::{DisplayStyle, SortBy};
use serde::{Deserialize, Deserializer, Serialize, de::DeserializeOwned};
use serde_json::Value;

#[derive(Debug, Default, Serialize, Deserialize, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct AppState {
    pub sort: SortState,
    #[serde(deserialize_with = "ok_or_default")]
    pub display_style: DisplayStyle,
}

#[derive(Debug, Serialize, Deserialize, Clone, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct SortState {
    #[serde(deserialize_with = "ok_or_default")]
    pub sort_by: SortBy,
    #[serde(deserialize_with = "ok_or_true")]
    pub reversed: bool,
}

impl SortState {
    pub fn new(sort_by: SortBy, reversed: bool) -> Self {
        Self { sort_by, reversed }
    }
}

impl Default for SortState {
    fn default() -> Self {
        Self {
            sort_by: SortBy::CreatedAt,
            reversed: true,
        }
    }
}

fn ok_or_default<'de, T, D>(deserializer: D) -> Result<T, D::Error>
where
    T: DeserializeOwned + Default,
    D: Deserializer<'de>,
{
    let v: Value = Deserialize::deserialize(deserializer)?;
    Ok(T::deserialize(v).unwrap_or_default())
}

fn ok_or_true<'de, D>(deserializer: D) -> Result<bool, D::Error>
where
    D: Deserializer<'de>,
{
    let v: Value = Deserialize::deserialize(deserializer)?;
    Ok(v.as_bool().unwrap_or(true))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_app_state_default_sort_reversed() {
        let app_state = AppState::default();
        assert_eq!(app_state.sort.reversed, true);
        assert_eq!(app_state.sort.sort_by, SortBy::CreatedAt);
    }

    #[test]
    fn test_sort_state_default() {
        let sort_state = SortState::default();
        assert_eq!(sort_state.reversed, true);
        assert_eq!(sort_state.sort_by, SortBy::CreatedAt);
    }
}
