import { AssetType, commands, FilterRequest } from '@/lib/bindings'
import { extractBoothItemId } from '@/lib/booth'
import { AssetFilterCriteria } from '../AssetFilterContext'

export const getFilteredAssetIds = async (
  criteria: AssetFilterCriteria,
): Promise<string[] | null> => {
  const request = createFilterRequest(criteria)

  const result = await commands.getFilteredAssetIds(request)

  if (result.status === 'ok') {
    return result.data
  } else {
    console.error(result.error)
    return null
  }
}

const createFilterRequest = (criteria: AssetFilterCriteria): FilterRequest => {
  let requestAssetType: AssetType | null
  let requestQuery: string | null
  let requestCategories: string[] | null
  let requestTags: string[] | null
  let requestSupportedAvatars: string[] | null

  if (criteria.assetType !== 'All') {
    requestAssetType = criteria.assetType
  } else {
    requestAssetType = null
  }

  if (criteria.queryTextMode === 'general') {
    if (criteria.generalQueryTextFilter.length > 0) {
      requestQuery = criteria.generalQueryTextFilter.replace(
        /\S+/g,
        (token) => {
          const extracted = extractBoothItemId(token)
          return extracted.status === 'ok' ? `${extracted.data}` : token
        },
      )
    } else {
      requestQuery = null
    }
  } else if (criteria.queryTextMode === 'advanced') {
    if (
      criteria.queryTextFilterForName.length <= 0 &&
      criteria.queryTextFilterForCreator.length <= 0
    ) {
      requestQuery = null
    } else {
      const queries = []

      for (const splitted of criteria.queryTextFilterForName.split(' ')) {
        if (splitted.length > 0) {
          queries.push(`name:${splitted}`)
        }
      }

      for (const splitted of criteria.queryTextFilterForCreator.split(' ')) {
        if (splitted.length > 0) {
          queries.push(`creator:${splitted}`)
        }
      }

      requestQuery = queries.join(' ')
    }
  } else {
    requestQuery = null
  }

  if (criteria.assetType !== 'Avatar' && criteria.categoryFilter.length > 0) {
    requestCategories = criteria.categoryFilter
  } else {
    requestCategories = null
  }

  if (criteria.tagFilter.length > 0) {
    requestTags = criteria.tagFilter
  } else {
    requestTags = null
  }

  const enableSupportedAvatarFilter =
    criteria.assetType === 'AvatarWearable' || criteria.assetType === 'All'
  if (
    enableSupportedAvatarFilter &&
    criteria.supportedAvatarFilter.length > 0
  ) {
    requestSupportedAvatars = criteria.supportedAvatarFilter
  } else {
    requestSupportedAvatars = null
  }

  const filterReq: FilterRequest = {
    assetType: requestAssetType,
    queryText: requestQuery,
    categories: requestCategories,
    tags: requestTags,
    tagMatchType: criteria.tagFilterMatchType,
    supportedAvatars: requestSupportedAvatars,
    supportedAvatarMatchType: criteria.supportedAvatarFilterMatchType,
  }

  return filterReq
}
