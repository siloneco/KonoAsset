import { AssetType, MatchType } from '@/lib/bindings'
import { create } from 'zustand'
import { DEFAULT_FILTERS } from './index.constants'
import { getFilteredAssetIds } from './logic'

export type AssetFilters = {
  text: {
    mode: 'general' | 'advanced'
    generalQuery: string
    advancedNameQuery: string
    advancedCreatorQuery: string
  }
  assetType: AssetType | 'All'
  category: string[]
  tag: {
    type: MatchType
    filters: string[]
  }
  supportedAvatar: {
    type: MatchType
    filters: string[]
  }
}

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P]
}

type Props = {
  filteredIds: string[] | null
  filters: AssetFilters
  updateFilter: (filter: RecursivePartial<AssetFilters>) => void
  refreshFilteredIds: () => Promise<void>
  clearFilters: () => void
}

export const useAssetFilterStore = create<Props>((set, get) => ({
  filteredIds: null,
  filters: DEFAULT_FILTERS,
  updateFilter: (filter: RecursivePartial<AssetFilters>) => {
    const currentFilters = get().filters

    const newFilters: AssetFilters = {
      ...currentFilters,
      ...(filter.text && {
        text: {
          ...currentFilters.text,
          ...filter.text,
        },
      }),
      ...(filter.assetType !== undefined && { assetType: filter.assetType }),
      ...(filter.category && { category: filter.category }),
      ...(filter.tag && {
        tag: {
          ...currentFilters.tag,
          ...filter.tag,
        },
      }),
      ...(filter.supportedAvatar && {
        supportedAvatar: {
          ...currentFilters.supportedAvatar,
          ...filter.supportedAvatar,
        },
      }),
    }

    set({
      filters: newFilters,
    })

    getFilteredAssetIds(newFilters).then((filteredIds) => {
      set({
        filteredIds,
      })
    })
  },
  refreshFilteredIds: async () => {
    const filteredIds = await getFilteredAssetIds(get().filters)
    set({
      filteredIds,
    })
  },
  clearFilters: () => {
    set({
      filters: DEFAULT_FILTERS,
      filteredIds: null,
    })
  },
}))
