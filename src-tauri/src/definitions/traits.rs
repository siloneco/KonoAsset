use uuid::Uuid;

use super::entities::AssetDescription;

pub trait AssetTrait {
    fn filename() -> String;
    fn get_id(&self) -> Uuid;
    fn set_id(&mut self, id: Uuid);
    fn get_description(&self) -> &AssetDescription;
    fn get_description_as_mut(&mut self) -> &mut AssetDescription;
}
