import { AssetSummary } from '@/lib/bindings'
import { createContext, FC } from 'react'
import { useAssetContext } from './hook'

export type AssetContextType = {
  assetDisplaySortedList: AssetSummary[]
  setAssetDisplaySortedList: (assetDisplaySortedList: AssetSummary[]) => void

  filteredIds: string[] | null
  setFilteredIds: (filteredIds: string[] | null) => void

  deleteAssetById: (id: string) => void

  refreshAssets: () => Promise<void>
}

export const AssetContext = createContext<AssetContextType>({
  assetDisplaySortedList: [],
  setAssetDisplaySortedList: () => {},

  filteredIds: null,
  setFilteredIds: () => {},

  deleteAssetById: () => {},

  refreshAssets: async () => {},
})

type Props = {
  children: React.ReactNode
}

export const AssetContextProvider: FC<Props> = ({ children }) => {
  const { value } = useAssetContext()

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
}
