import { AssetSummary, AssetType } from '@/lib/bindings'
import { createContext } from 'react'

export type AssetContextType = {
  assetDisplaySortedList: AssetSummary[]
  setAssetDisplaySortedList: (assetDisplaySortedList: AssetSummary[]) => void

  deleteAssetById: (id: string) => void

  refreshAssets: (assetType?: AssetType) => Promise<void>
}

export const AssetContext = createContext<AssetContextType>({
  assetDisplaySortedList: [],
  setAssetDisplaySortedList: () => {},

  deleteAssetById: () => {},

  refreshAssets: async () => {},
})
