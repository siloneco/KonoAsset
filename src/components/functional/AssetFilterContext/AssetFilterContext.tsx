import { AssetType, MatchType } from '@/lib/bindings'
import { createContext, FC } from 'react'
import { DEFAULT_CRITERIA } from './AssetFilterContext.constants'
import { useAssetFilterContext } from './hook'

export type AssetFilterCriteria = {
  queryTextMode: 'general' | 'advanced'
  generalQueryTextFilter: string
  queryTextFilterForName: string
  queryTextFilterForCreator: string
  assetType: AssetType | 'All'
  categoryFilter: string[]
  tagFilter: string[]
  tagFilterMatchType: MatchType
  supportedAvatarFilter: string[]
  supportedAvatarFilterMatchType: MatchType
}

export type AssetFilterContextType = AssetFilterCriteria & {
  matchedAssetIds: string[] | null
  updateFilter: (criteria: Partial<AssetFilterCriteria>) => void
  clearFilters: () => void
}

export const AssetFilterContext = createContext<AssetFilterContextType>({
  ...DEFAULT_CRITERIA,
  matchedAssetIds: null,
  updateFilter: () => {},
  clearFilters: () => {},
})

type Props = {
  children: React.ReactNode
}

export const AssetFilterContextProvider: FC<Props> = ({ children }) => {
  const { providerValue } = useAssetFilterContext()

  return (
    <AssetFilterContext.Provider value={providerValue}>
      {children}
    </AssetFilterContext.Provider>
  )
}
