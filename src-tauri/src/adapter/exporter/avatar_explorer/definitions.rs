use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "PascalCase")]
pub struct AvatarExplorerItem {
    pub title: String,
    pub author_name: String,
    pub item_memo: String,
    pub author_id: String,
    pub booth_id: i64,
    pub item_path: String,
    pub material_path: String,
    pub thumbnail_url: String,
    pub image_path: String,
    pub author_image_url: String,
    pub author_image_file_path: String,
    #[serde(rename = "Type")]
    pub item_type: u8,
    pub custom_category: String,
    pub supported_avatar: Vec<String>,
    pub created_date: String,
    pub updated_date: String,
}
