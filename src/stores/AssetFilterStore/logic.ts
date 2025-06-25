import { AssetType, commands, FilterRequest } from '@/lib/bindings'
import { AssetFilters } from '.'
import { extractBoothItemId } from '@/lib/utils'

export const getFilteredAssetIds = async (filters: AssetFilters) => {
  if (!isFilterEnforced(filters)) {
    return null
  }

  const filterReq = createFilterRequest(filters)

  const result = await commands.getFilteredAssetIds(filterReq)

  if (result.status === 'error') {
    console.error(result.error)
    return null
  }

  return result.data
}

const isFilterEnforced = (filters: AssetFilters) => {
  return (
    filters.assetType !== 'All' ||
    filters.text.generalQuery.length > 0 ||
    filters.text.advancedNameQuery.length > 0 ||
    filters.text.advancedCreatorQuery.length > 0 ||
    filters.category.length > 0 ||
    filters.tag.filters.length > 0 ||
    filters.supportedAvatar.filters.length > 0
  )
}

const createFilterRequest = (filters: AssetFilters): FilterRequest => {
  let requestAssetType: AssetType | null
  let requestQuery: string | null
  let requestCategories: string[] | null
  let requestTags: string[] | null
  let requestSupportedAvatars: string[] | null

  if (filters.assetType !== 'All') {
    requestAssetType = filters.assetType
  } else {
    requestAssetType = null
  }

  if (filters.text.mode === 'general') {
    if (filters.text.generalQuery.length > 0) {
      requestQuery = filters.text.generalQuery.replace(/\S+/g, (token) => {
        const extracted = extractBoothItemId(token)
        return extracted.status === 'ok' ? `${extracted.data}` : token
      })
    } else {
      requestQuery = null
    }
  } else if (filters.text.mode === 'advanced') {
    if (
      filters.text.advancedNameQuery.length <= 0 &&
      filters.text.advancedCreatorQuery.length <= 0
    ) {
      requestQuery = null
    } else {
      const queries = []

      for (const splitted of filters.text.advancedNameQuery.split(' ')) {
        if (splitted.length === 0) {
          continue
        }

        if (splitted.startsWith('-')) {
          if (splitted.length === 1) {
            continue
          }

          queries.push(`-name:${splitted.slice(1)}`)
        } else {
          queries.push(`name:${splitted}`)
        }
      }

      for (const splitted of filters.text.advancedCreatorQuery.split(' ')) {
        if (splitted.length === 0) {
          continue
        }

        if (splitted.startsWith('-')) {
          if (splitted.length === 1) {
            continue
          }

          queries.push(`-creator:${splitted.slice(1)}`)
        } else {
          queries.push(`creator:${splitted}`)
        }
      }

      requestQuery = queries.join(' ')
    }
  } else {
    requestQuery = null
  }

  if (filters.assetType !== 'Avatar' && filters.category.length > 0) {
    requestCategories = filters.category
  } else {
    requestCategories = null
  }

  if (filters.tag.filters.length > 0) {
    requestTags = filters.tag.filters
  } else {
    requestTags = null
  }

  const enableSupportedAvatarFilter =
    filters.assetType === 'AvatarWearable' || filters.assetType === 'All'
  if (
    enableSupportedAvatarFilter &&
    filters.supportedAvatar.filters.length > 0
  ) {
    requestSupportedAvatars = filters.supportedAvatar.filters
  } else {
    requestSupportedAvatars = null
  }

  const filterReq: FilterRequest = {
    assetType: requestAssetType,
    queryText: requestQuery,
    categories: requestCategories,
    tags: requestTags,
    tagMatchType: filters.tag.type,
    supportedAvatars: requestSupportedAvatars,
    supportedAvatarMatchType: filters.supportedAvatar.type,
  }

  return filterReq
}
