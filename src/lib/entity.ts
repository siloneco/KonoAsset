export type AssetDisplay = {
  id: string
  asset_type: AssetType
  title: string
  author: string
  image_src: string
  booth_url: string | null
}

export type AssetDescription = {
  title: string
  author: string
  image_src: string
  tags: string[]
  booth_url: string | null
  created_at: number
  published_at: number | null
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

export enum SortBy {
  Title = 'Title',
  Author = 'Author',
  CreatedAt = 'CreatedAt',
  PublishedAt = 'PublishedAt',
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

export enum MatchType {
  AND = 'AND',
  OR = 'OR',
}

export type FilterRequest = {
  asset_type?: AssetType
  query?: string
  categories?: string[]
  tags?: string[]
  tag_match_type: MatchType
  supported_avatars?: string[]
  supported_avatar_match_type: MatchType
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

export type CheckForUpdateResult = {
  success: boolean
  error_message?: string
  update_available: boolean
  update_version?: string
}
