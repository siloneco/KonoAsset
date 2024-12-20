import { AssetType, MatchType } from '@/lib/entity'
import { createContext } from 'react'

export type AssetFilterContextType = {
  textFilter: string
  setTextFilter: (filter: string) => void

  assetType: AssetType | 'all'
  setAssetType: (type: AssetType | 'all') => void

  categoryFilter: string[]
  setCategoryFilter: (filter: string[]) => void

  tagFilter: string[]
  setTagFilter: (filter: string[]) => void
  tagFilterMatchType: MatchType
  setTagFilterMatchType: (matchType: MatchType) => void

  supportedAvatarFilter: string[]
  setSupportedAvatarFilter: (filter: string[]) => void
  supportedAvatarFilterMatchType: MatchType
  setSupportedAvatarFilterMatchType: (matchType: MatchType) => void
}

export const AssetFilterContext = createContext<AssetFilterContextType>({
  textFilter: '',
  setTextFilter: () => {},

  assetType: 'all',
  setAssetType: () => {},

  categoryFilter: [],
  setCategoryFilter: () => {},

  tagFilter: [],
  setTagFilter: () => {},
  tagFilterMatchType: MatchType.OR,
  setTagFilterMatchType: () => {},

  supportedAvatarFilter: [],
  setSupportedAvatarFilter: () => {},
  supportedAvatarFilterMatchType: MatchType.OR,
  setSupportedAvatarFilterMatchType: () => {},
})
