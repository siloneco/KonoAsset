use serde::{Deserialize, Serialize};

#[derive(Default, Serialize, Deserialize, Debug, Eq, PartialEq, Clone, specta::Type)]
pub enum SortBy {
    Name,
    Creator,
    #[default]
    CreatedAt,
    PublishedAt,
}

#[derive(Default, Serialize, Deserialize, Debug, Eq, PartialEq, Clone, specta::Type)]
pub enum DisplayStyle {
    GridSmall,
    #[default]
    GridMedium,
    GridLarge,
    List,
}
