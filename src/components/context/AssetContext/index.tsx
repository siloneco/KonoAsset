import { AssetSummary, AssetType } from '@/lib/bindings'
import { createContext } from 'react'

export type AssetContextType = {
  assetDisplaySortedList: AssetSummary[]
  setAssetDisplaySortedList: (assetDisplaySortedList: AssetSummary[]) => void

  filteredIds: string[] | null
  setFilteredIds: (filteredIds: string[] | null) => void

  deleteAssetById: (id: string) => void

  refreshAssets: (assetType?: AssetType) => Promise<void>
}

export const AssetContext = createContext<AssetContextType>({
  assetDisplaySortedList: [],
  setAssetDisplaySortedList: () => {},

  filteredIds: null,
  setFilteredIds: () => {},

  deleteAssetById: () => {},

  refreshAssets: async () => {},
})
