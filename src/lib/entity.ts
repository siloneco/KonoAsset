export type AssetItem = {
  id: string;
  title: string;
  author: string;
  types: AssetType[];
  image_src: string;
  category: AssetCategory;
  asset_dirs: string[];
  tags: AssetTag[];
  created_at: string;
};

export type PreAssetItem = {
  title: string;
  author: string;
  types: AssetType[];
  image_src: string;
  category: AssetCategory;
  asset_dirs: string[];
  tags: AssetTag[];
};

export type AssetTag = {
  name: string;
  color: string;
};

export type AssetCategory = {
  display_name: string;
};

export enum AssetType {
  Avatar = "Avatar",
  AvatarRelatedAssets = "AvatarRelatedAssets",
  WorldRelatedAssets = "WorldRelatedAssets",
}
