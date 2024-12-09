use crate::definitions::entities::AssetItem;

pub trait AssetItemStore {
    fn save(&self, item: AssetItem);
    fn load(&self) -> Vec<AssetItem>;
    fn delete(&self, id: String) -> bool;
}
