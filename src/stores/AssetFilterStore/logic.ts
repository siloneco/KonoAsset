import {
  AssetType,
  commands,
  FilterElement,
  FilterRequest,
  FilterRequirement,
} from '@/lib/bindings'
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
    filters.category.type === 'Unlabeled' ||
    filters.category.filters.length > 0 ||
    filters.tag.type === 'Unlabeled' ||
    filters.tag.filters.length > 0 ||
    filters.supportedAvatar.type === 'Unlabeled' ||
    filters.supportedAvatar.filters.length > 0
  )
}

const createFilterRequest = (filters: AssetFilters): FilterRequest => {
  let requestAssetType: AssetType | null
  let requestQuery: string | null
  let requestCategories: FilterElement<FilterRequirement<string>> | null
  let requestTags: FilterElement<FilterRequirement<string>> | null
  let requestSupportedAvatars: FilterElement<FilterRequirement<string>> | null

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

  if (filters.assetType !== 'Avatar') {
    if (filters.category.type === 'Unlabeled') {
      requestCategories = { type: 'Unlabeled' }
    } else if (filters.category.filters.length > 0) {
      requestCategories = {
        type: filters.category.type,
        data: filters.category.filters.map(convertItemsToFilterRequirements),
      }
    } else {
      requestCategories = null
    }
  } else {
    requestCategories = null
  }

  if (filters.tag.type === 'Unlabeled') {
    requestTags = { type: 'Unlabeled' }
  } else if (filters.tag.filters.length > 0) {
    requestTags = {
      type: filters.tag.type,
      data: filters.tag.filters.map(convertItemsToFilterRequirements),
    }
  } else {
    requestTags = null
  }

  const enableSupportedAvatarFilter =
    filters.assetType === 'AvatarWearable' || filters.assetType === 'All'

  if (enableSupportedAvatarFilter) {
    if (filters.supportedAvatar.type === 'Unlabeled') {
      requestSupportedAvatars = { type: 'Unlabeled' }
    } else if (filters.supportedAvatar.filters.length > 0) {
      requestSupportedAvatars = {
        type: filters.supportedAvatar.type,
        data: filters.supportedAvatar.filters.map(
          convertItemsToFilterRequirements,
        ),
      }
    } else {
      requestSupportedAvatars = null
    }
  } else {
    requestSupportedAvatars = null
  }

  const filterReq: FilterRequest = {
    assetType: requestAssetType,
    queryText: requestQuery,
    categories: requestCategories,
    tags: requestTags,
    supportedAvatars: requestSupportedAvatars,
  }

  return filterReq
}

const convertItemsToFilterRequirements = (
  item: string,
): FilterRequirement<string> => {
  if (item.startsWith('-')) {
    return {
      type: 'Exclude',
      data: item.slice(1),
    }
  } else {
    return {
      type: 'Include',
      data: item,
    }
  }
}
