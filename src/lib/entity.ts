export type AssetDescription = {
  title: string
  author: string
  image_src: string
  tags: string[]
  created_at: string
}

export type AvatarAsset = {
  id: string
  description: AssetDescription
}

export type AvatarRelatedAssets = {
  id: string
  description: AssetDescription
  category: string
  supported_avatars: string[]
}

export type WorldRelatedAssets = {
  id: string
  description: AssetDescription
  category: string
}

export type PreAvatarAsset = Omit<AvatarAsset, 'id'>
export type PreAvatarRelatedAssets = Omit<AvatarRelatedAssets, 'id'>
export type PreWorldRelatedAssets = Omit<WorldRelatedAssets, 'id'>

export enum AssetType {
  Avatar = 'Avatar',
  AvatarRelated = 'AvatarRelated',
  World = 'World',
}

export type AssetImportRequest = {
  pre_asset: PreAvatarAsset | PreAvatarRelatedAssets | PreWorldRelatedAssets
  file_or_dir_absolute_path: string
}

export type AssetImportResult = {
  success: boolean
  asset?: AvatarAsset | AvatarRelatedAssets | WorldRelatedAssets
  error_message?: string
}

export type DirectoryOpenResult = {
  success: boolean
  error_message?: string
}

export type FetchAssetDescriptionFromBoothResult = {
  success: boolean
  asset_description?: AssetDescription
  estimated_asset_type?: AssetType
  error_message?: string
}
