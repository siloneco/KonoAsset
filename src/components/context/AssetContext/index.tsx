import { createContext } from 'react'
import { AssetDisplay, AssetType } from '@/lib/entity'

export type AssetContextType = {
  assetDisplaySortedList: AssetDisplay[]
  setAssetDisplaySortedList: (assetDisplaySortedList: AssetDisplay[]) => void

  deleteAssetById: (id: string) => void

  refreshAssets: (assetType?: AssetType) => Promise<void>
}

export const AssetContext = createContext<AssetContextType>({
  assetDisplaySortedList: [],
  setAssetDisplaySortedList: () => {},

  deleteAssetById: () => {},

  refreshAssets: async () => {},
})
