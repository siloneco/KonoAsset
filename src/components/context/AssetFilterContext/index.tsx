import { AssetType } from '@/lib/entity'
import { createContext } from 'react'

export type AssetFilterContextType = {
  textFilter: string
  setTextFilter: (filter: string) => void

  assetType: AssetType | ''
  setAssetType: (type: AssetType | '') => void

  supportedAvatarFilter: string[]
  setSupportedAvatarFilter: (filter: string[]) => void

  categoryFilter: string[]
  setCategoryFilter: (filter: string[]) => void

  tagFilter: string[]
  setTagFilter: (filter: string[]) => void
}

export const AssetFilterContext = createContext<AssetFilterContextType>({
  textFilter: '',
  setTextFilter: () => {},

  assetType: '',
  setAssetType: () => {},

  supportedAvatarFilter: [],
  setSupportedAvatarFilter: () => {},

  categoryFilter: [],
  setCategoryFilter: () => {},

  tagFilter: [],
  setTagFilter: () => {},
})
