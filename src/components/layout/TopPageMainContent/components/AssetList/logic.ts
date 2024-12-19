import { AssetType, FilterRequest, MatchType } from '@/lib/entity'

export const isFilterEnforced = (filterRequest: FilterRequest) => {
  return (
    filterRequest.asset_type !== undefined ||
    filterRequest.query !== undefined ||
    filterRequest.categories !== undefined ||
    filterRequest.tags !== undefined ||
    filterRequest.supported_avatars !== undefined
  )
}

type Props = {
  assetType: AssetType | ''
  query: string
  categories: string[]
  categoryMatchType: MatchType
  tags: string[]
  tagMatchType: MatchType
  supported_avatars: string[]
  supportedAvatarMatchType: MatchType
}

export const createFilterRequest = ({
  assetType,
  query,
  categories,
  categoryMatchType,
  tags,
  tagMatchType,
  supported_avatars,
  supportedAvatarMatchType,
}: Props): FilterRequest => {
  let requestAssetType: AssetType | undefined
  let requestQuery: string | undefined
  let requestCategories: string[] | undefined
  let requestTags: string[] | undefined
  let requestSupportedAvatars: string[] | undefined

  if (assetType !== '') {
    requestAssetType = assetType
  } else {
    requestAssetType = undefined
  }

  if (query.length > 0) {
    requestQuery = query
  } else {
    requestQuery = undefined
  }

  if (categories.length > 0) {
    requestCategories = categories
  } else {
    requestCategories = undefined
  }

  if (tags.length > 0) {
    requestTags = tags
  } else {
    requestTags = undefined
  }

  if (supported_avatars.length > 0) {
    requestSupportedAvatars = supported_avatars
  } else {
    requestSupportedAvatars = undefined
  }

  return {
    asset_type: requestAssetType,
    query: requestQuery,
    categories: requestCategories,
    category_match_type: categoryMatchType,
    tags: requestTags,
    tag_match_type: tagMatchType,
    supported_avatars: requestSupportedAvatars,
    supported_avatar_match_type: supportedAvatarMatchType,
  }
}
