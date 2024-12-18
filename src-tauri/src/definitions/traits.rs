use uuid::Uuid;

use super::entities::AssetDescription;

pub trait AssetTrait {
    fn filename() -> String;
    fn get_id(&self) -> Uuid;
    fn get_description(&self) -> &AssetDescription;
}
