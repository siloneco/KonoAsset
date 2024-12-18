export type AssetDescription = {
  title: string
  author: string
  image_src: string
  tags: string[]
  created_at: number
}

export type AvatarAsset = {
  id: string
  description: AssetDescription
}

export type AvatarRelatedAsset = {
  id: string
  description: AssetDescription
  category: string
  supported_avatars: string[]
}

export type WorldAsset = {
  id: string
  description: AssetDescription
  category: string
}

export type PreAvatarAsset = Omit<AvatarAsset, 'id'>
export type PreAvatarRelatedAsset = Omit<AvatarRelatedAsset, 'id'>
export type PreWorldAsset = Omit<WorldAsset, 'id'>

export enum AssetType {
  Avatar = 'Avatar',
  AvatarRelated = 'AvatarRelated',
  World = 'World',
}

export type AssetImportRequest = {
  pre_asset: PreAvatarAsset | PreAvatarRelatedAsset | PreWorldAsset
  file_or_dir_absolute_path: string
}

export type AssetImportResult = {
  success: boolean
  asset?: AvatarAsset | AvatarRelatedAsset | WorldAsset
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

export type FilterRequest = {
  asset_type?: AssetType
  query?: string
  categories?: string[]
  tags?: string[]
  supported_avatars?: string[]
}

export type SimpleResult = {
  success: boolean
  error_message?: string
}

export type GetAssetResult = {
  success: boolean
  error_message?: string

  avatar_asset?: AvatarAsset
  avatar_related_asset?: AvatarRelatedAsset
  world_asset?: WorldAsset
}
