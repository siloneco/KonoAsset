use model::{Avatar, AvatarWearable, OtherAsset, WorldObject};

use super::definitions::AvatarExplorerItem;

pub struct AvatarExplorerItemBuilder {
    is_avatar: bool,

    title: String,
    author: String,
    memo: Option<String>,
    booth_item_id: Option<u64>,
    category: Option<String>,
    created_at: i64,

    relative_item_path: Option<String>,
}

impl AvatarExplorerItemBuilder {
    pub fn set_relative_item_path(mut self, path: String) -> Self {
        self.relative_item_path = Some(path);
        self
    }

    pub fn build(self) -> Result<AvatarExplorerItem, String> {
        if self.relative_item_path.is_none() {
            return Err("Item path is required".into());
        }

        let title = self.title;
        let author_name = self.author;
        let item_memo = self.memo.unwrap_or_default();

        let booth_id = match self.booth_item_id {
            Some(id) => id as i64,
            None => -1,
        };
        let item_path = self.relative_item_path.unwrap();

        let image_path = if booth_id >= 0 {
            format!(".\\Datas\\Thumbnail\\{}.png", booth_id)
        } else {
            "".to_string()
        };

        let (item_type, custom_category) = if self.is_avatar {
            (0, "".to_string())
        } else if let Some(category) = self.category.as_deref() {
            let num = estimates_item_type_from_category(category);

            if num < 9 {
                (num, "".to_string())
            } else {
                (9, category.to_string())
            }
        } else {
            (9, "Uncategorized".to_string())
        };

        let created_date = chrono::DateTime::<chrono::Utc>::from_timestamp_millis(self.created_at)
            .map(|dt| dt.format("%Y-%m-%d %H:%M:%S").to_string())
            .unwrap_or_else(|| self.created_at.to_string());
        let updated_date = created_date.clone();

        Ok(AvatarExplorerItem {
            title,
            author_name,
            item_memo,
            author_id: "".into(),
            booth_id,
            item_path,
            material_path: "".into(),
            thumbnail_url: "".into(),
            image_path,
            author_image_url: "".into(),
            author_image_file_path: "".into(),
            item_type,
            custom_category,
            supported_avatar: vec![], // Unable to migrate due to inability to convert from avatar string to actual avatar directory
            created_date,
            updated_date,
        })
    }
}

fn estimates_item_type_from_category(category: &str) -> u8 {
    match category.to_lowercase().as_str() {
        "アバター" | "avatar" | "avatars" => 0,
        "衣装" | "clothes" => 1,
        "テクスチャ" | "texture" | "textures" => 2,
        "ギミック" | "gimmick" | "gimmicks" => 3,
        "アクセサリー" | "アクセサリ" | "装飾品" | "accessory" | "accessories" => 4,
        "髪型" | "髪" | "髪の毛" | "hair" => 5,
        "アニメーション" | "animation" | "animations" => 6,
        "ツール" | "tool" | "tools" => 7,
        "シェーダー" | "shader" | "shaders" => 8,
        _ => 9,
    }
}

impl Into<AvatarExplorerItemBuilder> for Avatar {
    fn into(self) -> AvatarExplorerItemBuilder {
        let title = self.description.name;
        let author = self.description.creator;
        let memo = self.description.memo;
        let booth_item_id = self.description.booth_item_id;

        let created_at = self.description.created_at;

        AvatarExplorerItemBuilder {
            is_avatar: true,
            title,
            author,
            memo,
            booth_item_id,
            category: None,
            created_at,
            relative_item_path: None,
        }
    }
}

impl Into<AvatarExplorerItemBuilder> for AvatarWearable {
    fn into(self) -> AvatarExplorerItemBuilder {
        let title = self.description.name;
        let author = self.description.creator;
        let memo = self.description.memo;
        let booth_item_id = self.description.booth_item_id;

        let category = if self.category.is_empty() {
            None
        } else {
            Some(self.category)
        };

        let created_at = self.description.created_at;

        AvatarExplorerItemBuilder {
            is_avatar: false,
            title,
            author,
            memo,
            booth_item_id,
            category,
            created_at,
            relative_item_path: None,
        }
    }
}

impl Into<AvatarExplorerItemBuilder> for WorldObject {
    fn into(self) -> AvatarExplorerItemBuilder {
        let title = self.description.name;
        let author = self.description.creator;
        let memo = self.description.memo;
        let booth_item_id = self.description.booth_item_id;

        let category = if self.category.is_empty() {
            None
        } else {
            Some(format!("World: {}", self.category))
        };

        let created_at = self.description.created_at;

        AvatarExplorerItemBuilder {
            is_avatar: false,
            title,
            author,
            memo,
            booth_item_id,
            category,
            created_at,
            relative_item_path: None,
        }
    }
}

impl Into<AvatarExplorerItemBuilder> for OtherAsset {
    fn into(self) -> AvatarExplorerItemBuilder {
        let title = self.description.name;
        let author = self.description.creator;
        let memo = self.description.memo;
        let booth_item_id = self.description.booth_item_id;

        let category = if self.category.is_empty() {
            None
        } else {
            Some(self.category)
        };

        let created_at = self.description.created_at;

        AvatarExplorerItemBuilder {
            is_avatar: false,
            title,
            author,
            memo,
            booth_item_id,
            category,
            created_at,
            relative_item_path: None,
        }
    }
}

#[cfg(test)]
mod tests {
    use model::AssetDescription;
    use std::collections::BTreeSet;

    use super::*;
    use uuid::Uuid;

    #[test]
    fn test_builder_with_path() {
        let builder = AvatarExplorerItemBuilder {
            is_avatar: true,
            title: "Test Avatar".to_string(),
            author: "Test Author".to_string(),
            memo: Some("Test Memo".to_string()),
            booth_item_id: Some(12345),
            category: None,
            created_at: 1735689600000, // 2025-01-01 00:00:00
            relative_item_path: Some("path/to/avatar".to_string()),
        };

        let result = builder.build();
        assert!(result.is_ok());

        let item = result.unwrap();
        assert_eq!(item.title, "Test Avatar");
        assert_eq!(item.author_name, "Test Author");
        assert_eq!(item.item_memo, "Test Memo");
        assert_eq!(item.booth_id, 12345);
        assert_eq!(item.item_path, "path/to/avatar");
        assert_eq!(item.image_path, ".\\Datas\\Thumbnail\\12345.png");
        assert_eq!(item.item_type, 0);
        assert_eq!(item.custom_category, "");
        assert_eq!(item.created_date, "2025-01-01 00:00:00");
        assert_eq!(item.updated_date, "2025-01-01 00:00:00");
    }

    #[test]
    fn test_set_relative_item_path() {
        let builder = AvatarExplorerItemBuilder {
            is_avatar: true,
            title: "Test Avatar".to_string(),
            author: "Test Author".to_string(),
            memo: None,
            booth_item_id: None,
            category: None,
            created_at: 1735689600000,
            relative_item_path: None,
        };

        let builder = builder.set_relative_item_path("new/path".to_string());
        let result = builder.build();

        assert!(result.is_ok());
        assert_eq!(result.unwrap().item_path, "new/path");
    }

    #[test]
    fn test_avatar_into_builder() {
        let avatar = Avatar {
            id: Uuid::new_v4(),
            description: AssetDescription {
                name: "Test Avatar".to_string(),
                creator: "Test Creator".to_string(),
                image_filename: Some("image.png".to_string()),
                tags: vec!["tag1".to_string(), "tag2".to_string()],
                memo: Some("Test Memo".to_string()),
                booth_item_id: Some(12345),
                dependencies: vec![],
                created_at: 1735689600000, // 2025-01-01 00:00:00
                published_at: Some(1735689600000),
            },
        };

        let builder: AvatarExplorerItemBuilder = avatar.into();

        assert_eq!(builder.is_avatar, true);
        assert_eq!(builder.title, "Test Avatar");
        assert_eq!(builder.author, "Test Creator");
        assert_eq!(builder.memo, Some("Test Memo".to_string()));
        assert_eq!(builder.booth_item_id, Some(12345));
        assert_eq!(builder.category, None);
        assert_eq!(builder.created_at, 1735689600000);
        assert_eq!(builder.relative_item_path, None);
    }

    #[test]
    fn test_avatar_wearable_into_builder() {
        let wearable = AvatarWearable {
            id: Uuid::new_v4(),
            description: AssetDescription {
                name: "Test Wearable".to_string(),
                creator: "Test Creator".to_string(),
                image_filename: Some("image.png".to_string()),
                tags: vec!["tag1".to_string(), "tag2".to_string()],
                memo: Some("Test Memo".to_string()),
                booth_item_id: Some(12345),
                dependencies: vec![],
                created_at: 1735689600000, // 2025-01-01 00:00:00
                published_at: Some(1735689600000),
            },
            category: "Accessory".to_string(),
            supported_avatars: BTreeSet::new(),
        };

        let builder: AvatarExplorerItemBuilder = wearable.into();

        assert_eq!(builder.is_avatar, false);
        assert_eq!(builder.title, "Test Wearable");
        assert_eq!(builder.author, "Test Creator");
        assert_eq!(builder.memo, Some("Test Memo".to_string()));
        assert_eq!(builder.booth_item_id, Some(12345));
        assert_eq!(builder.category, Some("Accessory".to_string()));
        assert_eq!(builder.created_at, 1735689600000);
        assert_eq!(builder.relative_item_path, None);

        let wearable = AvatarWearable {
            id: Uuid::new_v4(),
            description: AssetDescription {
                name: "Test Wearable".to_string(),
                creator: "Test Creator".to_string(),
                image_filename: None,
                tags: vec![],
                memo: None,
                booth_item_id: None,
                dependencies: vec![],
                created_at: 1735689600000,
                published_at: None,
            },
            category: "".to_string(),
            supported_avatars: BTreeSet::new(),
        };

        let builder: AvatarExplorerItemBuilder = wearable.into();
        assert_eq!(builder.category, None);
    }

    #[test]
    fn test_world_object_into_builder() {
        let world_object = WorldObject {
            id: Uuid::new_v4(),
            description: AssetDescription {
                name: "Test World Object".to_string(),
                creator: "Test Creator".to_string(),
                image_filename: Some("image.png".to_string()),
                tags: vec!["tag1".to_string(), "tag2".to_string()],
                memo: Some("Test Memo".to_string()),
                booth_item_id: Some(12345),
                dependencies: vec![],
                created_at: 1735689600000, // 2025-01-01 00:00:00
                published_at: Some(1735689600000),
            },
            category: "Prop".to_string(),
        };

        let builder: AvatarExplorerItemBuilder = world_object.into();

        assert_eq!(builder.is_avatar, false);
        assert_eq!(builder.title, "Test World Object");
        assert_eq!(builder.author, "Test Creator");
        assert_eq!(builder.memo, Some("Test Memo".to_string()));
        assert_eq!(builder.booth_item_id, Some(12345));
        assert_eq!(builder.category, Some("World: Prop".to_string()));
        assert_eq!(builder.created_at, 1735689600000);
        assert_eq!(builder.relative_item_path, None);

        let world_object = WorldObject {
            id: Uuid::new_v4(),
            description: AssetDescription {
                name: "Test World Object".to_string(),
                creator: "Test Creator".to_string(),
                image_filename: None,
                tags: vec![],
                memo: None,
                booth_item_id: None,
                dependencies: vec![],
                created_at: 1735689600000,
                published_at: None,
            },
            category: "".to_string(),
        };

        let builder: AvatarExplorerItemBuilder = world_object.into();
        assert_eq!(builder.category, None);
    }

    #[test]
    fn test_other_asset_into_builder() {
        let other_asset = OtherAsset {
            id: Uuid::new_v4(),
            description: AssetDescription {
                name: "Test Other Asset".to_string(),
                creator: "Test Creator".to_string(),
                image_filename: Some("image.png".to_string()),
                tags: vec!["tag1".to_string(), "tag2".to_string()],
                memo: Some("Test Memo".to_string()),
                booth_item_id: Some(12345),
                dependencies: vec![],
                created_at: 1735689600000, // 2025-01-01 00:00:00
                published_at: Some(1735689600000),
            },
            category: "Category".to_string(),
        };

        let builder: AvatarExplorerItemBuilder = other_asset.into();

        assert_eq!(builder.is_avatar, false);
        assert_eq!(builder.title, "Test Other Asset");
        assert_eq!(builder.author, "Test Creator");
        assert_eq!(builder.memo, Some("Test Memo".to_string()));
        assert_eq!(builder.booth_item_id, Some(12345));
        assert_eq!(builder.category, Some("Category".to_string()));
        assert_eq!(builder.created_at, 1735689600000);
        assert_eq!(builder.relative_item_path, None);

        let other_asset = OtherAsset {
            id: Uuid::new_v4(),
            description: AssetDescription {
                name: "Test Other Asset".to_string(),
                creator: "Test Creator".to_string(),
                image_filename: None,
                tags: vec![],
                memo: None,
                booth_item_id: None,
                dependencies: vec![],
                created_at: 1735689600000,
                published_at: None,
            },
            category: "".to_string(),
        };

        let builder: AvatarExplorerItemBuilder = other_asset.into();
        assert_eq!(builder.category, None);
    }

    #[test]
    fn test_item_type_and_custom_category() {
        let builder = AvatarExplorerItemBuilder {
            is_avatar: true,
            title: "Test Avatar".to_string(),
            author: "Test Author".to_string(),
            memo: None,
            booth_item_id: None,
            category: Some("Any Category".to_string()), // This should be ignored for avatars
            created_at: 1735689600000,
            relative_item_path: Some("path".to_string()),
        };

        let item = builder.build().unwrap();
        assert_eq!(item.item_type, 0);
        assert_eq!(item.custom_category, "");

        let builder = AvatarExplorerItemBuilder {
            is_avatar: false,
            title: "Test Item".to_string(),
            author: "Test Author".to_string(),
            memo: None,
            booth_item_id: None,
            category: Some("Accessory".to_string()),
            created_at: 1735689600000,
            relative_item_path: Some("path".to_string()),
        };

        let item = builder.build().unwrap();
        assert_eq!(item.item_type, 4);
        assert_eq!(item.custom_category, "");

        let builder = AvatarExplorerItemBuilder {
            is_avatar: false,
            title: "Test Item".to_string(),
            author: "Test Author".to_string(),
            memo: None,
            booth_item_id: None,
            category: Some("Custom Category".to_string()),
            created_at: 1735689600000,
            relative_item_path: Some("path".to_string()),
        };

        let item = builder.build().unwrap();
        assert_eq!(item.item_type, 9);
        assert_eq!(item.custom_category, "Custom Category");

        let builder = AvatarExplorerItemBuilder {
            is_avatar: false,
            title: "Test Item".to_string(),
            author: "Test Author".to_string(),
            memo: None,
            booth_item_id: None,
            category: None,
            created_at: 1735689600000,
            relative_item_path: Some("path".to_string()),
        };

        let item = builder.build().unwrap();
        assert_eq!(item.item_type, 9);
        assert_eq!(item.custom_category, "Uncategorized");
    }
}
