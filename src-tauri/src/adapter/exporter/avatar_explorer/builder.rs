use crate::definitions::entities::{Avatar, AvatarWearable, WorldObject};

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

#[cfg(test)]
mod tests {
    use super::*;
}
