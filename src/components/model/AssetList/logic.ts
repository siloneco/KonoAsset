import { AssetType, FilterRequest, MatchType } from '@/lib/bindings'

export const isFilterEnforced = (filterRequest: FilterRequest) => {
  return (
    filterRequest.assetType !== undefined ||
    filterRequest.text !== undefined ||
    filterRequest.categories !== undefined ||
    filterRequest.tags !== undefined ||
    filterRequest.supportedAvatars !== undefined
  )
}

type Props = {
  assetType: AssetType | 'All'
  text: string
  categories: string[]
  tags: string[]
  tagMatchType: MatchType
  supportedAvatars: string[]
  supportedAvatarMatchType: MatchType
}

export const createFilterRequest = ({
  assetType,
  text: query,
  categories,
  tags,
  tagMatchType,
  supportedAvatars,
  supportedAvatarMatchType,
}: Props): FilterRequest => {
  let requestAssetType: AssetType | null
  let requestQuery: string | null
  let requestCategories: string[] | null
  let requestTags: string[] | null
  let requestSupportedAvatars: string[] | null

  if (assetType !== 'All') {
    requestAssetType = assetType
  } else {
    requestAssetType = null
  }

  if (query.length > 0) {
    requestQuery = query
  } else {
    requestQuery = null
  }

  if (assetType !== 'Avatar' && categories.length > 0) {
    requestCategories = categories
  } else {
    requestCategories = null
  }

  if (tags.length > 0) {
    requestTags = tags
  } else {
    requestTags = null
  }

  const enableSupportedAvatarFilter =
    assetType === 'AvatarWearable' || assetType === 'All'
  if (enableSupportedAvatarFilter && supportedAvatars.length > 0) {
    requestSupportedAvatars = supportedAvatars
  } else {
    requestSupportedAvatars = null
  }

  const filterReq: FilterRequest = {
    assetType: requestAssetType,
    text: requestQuery,
    categories: requestCategories,
    tags: requestTags,
    tagMatchType: tagMatchType,
    supportedAvatars: requestSupportedAvatars,
    supportedAvatarMatchType: supportedAvatarMatchType,
  }

  return filterReq
}
