use model::{AssetTrait, Avatar, AvatarWearable, OtherAsset, WorldObject};
use std::{
    collections::HashMap,
    path::{Path, PathBuf},
};

pub struct CategoryBasedAssets {
    pub avatars: Vec<AssetExportOverview<Avatar>>,
    pub avatar_wearables: HashMap<String, Vec<AssetExportOverview<AvatarWearable>>>,
    pub world_objects: HashMap<String, Vec<AssetExportOverview<WorldObject>>>,
    pub other_assets: HashMap<String, Vec<AssetExportOverview<OtherAsset>>>,
}

impl CategoryBasedAssets {
    pub fn new(
        avatars: Vec<AssetExportOverview<Avatar>>,
        avatar_wearables: HashMap<String, Vec<AssetExportOverview<AvatarWearable>>>,
        world_objects: HashMap<String, Vec<AssetExportOverview<WorldObject>>>,
        other_assets: HashMap<String, Vec<AssetExportOverview<OtherAsset>>>,
    ) -> Self {
        Self {
            avatars,
            avatar_wearables,
            world_objects,
            other_assets,
        }
    }
}

pub struct AssetExportOverview<A: AssetTrait> {
    pub asset: A,
    pub data_dir: PathBuf,
}

impl AssetExportOverview<Avatar> {
    pub fn new<P>(asset: Avatar, root_dir: P) -> Self
    where
        P: AsRef<Path>,
    {
        let root_dir = root_dir.as_ref();
        let id = asset.id.to_string();

        let data_dir = root_dir.join("data").join(id);

        Self { asset, data_dir }
    }
}

impl AssetExportOverview<AvatarWearable> {
    pub fn new<P>(asset: AvatarWearable, root_dir: P) -> Self
    where
        P: AsRef<Path>,
    {
        let root_dir = root_dir.as_ref();
        let id = asset.id.to_string();

        let data_dir = root_dir.join("data").join(id);

        Self { asset, data_dir }
    }
}

impl AssetExportOverview<WorldObject> {
    pub fn new<P>(asset: WorldObject, root_dir: P) -> Self
    where
        P: AsRef<Path>,
    {
        let root_dir = root_dir.as_ref();
        let id = asset.id.to_string();

        let data_dir = root_dir.join("data").join(id);

        Self { asset, data_dir }
    }
}

impl AssetExportOverview<OtherAsset> {
    pub fn new<P>(asset: OtherAsset, root_dir: P) -> Self
    where
        P: AsRef<Path>,
    {
        let root_dir = root_dir.as_ref();
        let id = asset.id.to_string();

        let data_dir = root_dir.join("data").join(id);

        Self { asset, data_dir }
    }
}
