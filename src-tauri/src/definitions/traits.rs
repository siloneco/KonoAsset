use uuid::Uuid;

pub trait AssetTrait {
    fn filename() -> String;
    fn get_id(&self) -> Uuid;
}
