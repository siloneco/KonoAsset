export type AssetDescription = {
  title: string;
  author: string;
  image_src: string;
  asset_dirs: string[];
  tags: string[];
  created_at: string;
};

export type AvatarAsset = {
  id: string;
  description: AssetDescription;
};

export type AvatarRelatedAssets = {
  id: string;
  description: AssetDescription;
  category: string;
  supported_avatars: Set<string>;
};

export type WorldRelatedAssets = {
  id: string;
  description: AssetDescription;
  category: string;
};

export type PreAvatarAsset = Omit<AvatarAsset, "id">;
export type PreAvatarRelatedAssets = Omit<AvatarRelatedAssets, "id">;
export type PreWorldRelatedAssets = Omit<WorldRelatedAssets, "id">;

export enum AssetType {
  Avatar = "Avatar",
  AvatarRelatedAssets = "AvatarRelatedAssets",
  WorldRelatedAssets = "WorldRelatedAssets",
}
