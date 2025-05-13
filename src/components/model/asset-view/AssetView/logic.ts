import { AssetCardSize } from '@/components/context/PersistentContext'
import { AssetType, FilterRequest, MatchType } from '@/lib/bindings'
import { extractBoothItemId } from '@/lib/utils'

const SMALL_CARD_WIDTH = 160
const MEDIUM_CARD_WIDTH = 200
const LARGE_CARD_WIDTH = 260

export const calculateColumnCount = (
  width: number,
  size: Omit<AssetCardSize, 'List'>,
) => {
  if (size === 'Small') {
    return Math.floor(width / SMALL_CARD_WIDTH)
  } else if (size === 'Medium') {
    return Math.floor(width / MEDIUM_CARD_WIDTH)
  } else if (size === 'Large') {
    return Math.floor(width / LARGE_CARD_WIDTH)
  }

  // default
  return Math.floor(width / MEDIUM_CARD_WIDTH)
}

export const isFilterEnforced = (filterRequest: FilterRequest) => {
  return (
    filterRequest.assetType !== undefined ||
    filterRequest.queryText !== undefined ||
    filterRequest.categories !== undefined ||
    filterRequest.tags !== undefined ||
    filterRequest.supportedAvatars !== undefined
  )
}

type Props = {
  assetType: AssetType | 'All'
  queryTextMode: 'general' | 'advanced'
  generalQueryText: string
  queryTextFilterForName: string
  queryTextFilterForCreator: string
  categories: string[]
  tags: string[]
  tagMatchType: MatchType
  supportedAvatars: string[]
  supportedAvatarMatchType: MatchType
}

export const createFilterRequest = ({
  assetType,
  queryTextMode,
  generalQueryText,
  queryTextFilterForName,
  queryTextFilterForCreator,
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

  if (queryTextMode === 'general') {
    if (generalQueryText.length > 0) {
      requestQuery = generalQueryText.replace(/\S+/g, (token) => {
        const extracted = extractBoothItemId(token)
        return extracted.status === 'ok' ? `${extracted.data}` : token
      })
    } else {
      requestQuery = null
    }
  } else if (queryTextMode === 'advanced') {
    if (
      queryTextFilterForName.length <= 0 &&
      queryTextFilterForCreator.length <= 0
    ) {
      requestQuery = null
    } else {
      const queries = []

      for (const splitted of queryTextFilterForName.split(' ')) {
        if (splitted.length > 0) {
          queries.push(`name:${splitted}`)
        }
      }

      for (const splitted of queryTextFilterForCreator.split(' ')) {
        if (splitted.length > 0) {
          queries.push(`creator:${splitted}`)
        }
      }

      requestQuery = queries.join(' ')
    }
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
    queryText: requestQuery,
    categories: requestCategories,
    tags: requestTags,
    tagMatchType: tagMatchType,
    supportedAvatars: requestSupportedAvatars,
    supportedAvatarMatchType: supportedAvatarMatchType,
  }

  return filterReq
}
