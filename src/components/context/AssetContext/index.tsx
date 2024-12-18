import { createContext } from 'react'
import { AssetDisplay, AssetType, SortBy } from '@/lib/entity'

export type AssetContextType = {
  sortBy: SortBy
  setSortBy: (sortBy: SortBy) => void
  reverseOrder: boolean
  setReverseOrder: (reverseOrder: boolean) => void

  assetDisplaySortedList: AssetDisplay[]
  setAssetDisplaySortedList: (assetDisplaySortedList: AssetDisplay[]) => void

  deleteAssetById: (id: string) => void

  refreshAssets: (assetType?: AssetType) => Promise<void>
}

export const AssetContext = createContext<AssetContextType>({
  sortBy: SortBy.Title,
  setSortBy: () => {},
  reverseOrder: false,
  setReverseOrder: () => {},

  assetDisplaySortedList: [],
  setAssetDisplaySortedList: () => {},

  deleteAssetById: () => {},

  refreshAssets: async () => {},
})
