import { createContext, FC } from 'react'
import { usePersistentContext } from './hook'
import { AssetType, MatchType, SortBy } from '@/lib/bindings'

export type PersistentContextType = {
  sortBy: SortBy
  setSortBy: (sortBy: SortBy) => void
  reverseOrder: boolean
  setReverseOrder: (reverseOrder: boolean) => void

  queryTextMode: 'general' | 'advanced'
  setQueryTextMode: (mode: 'general' | 'advanced') => void

  generalQueryTextFilter: string
  setGeneralQueryTextFilter: (filter: string) => void

  queryTextFilterForName: string
  setQueryTextFilterForName: (filter: string) => void
  queryTextFilterForCreator: string
  setQueryTextFilterForCreator: (filter: string) => void

  assetType: AssetType | 'All'
  setAssetType: (type: AssetType | 'All') => void

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

  clearFilters: () => void
}

export const PersistentContext = createContext<PersistentContextType>({
  sortBy: 'CreatedAt',
  setSortBy: () => {},
  reverseOrder: false,
  setReverseOrder: () => {},

  queryTextMode: 'general',
  setQueryTextMode: () => {},

  generalQueryTextFilter: '',
  setGeneralQueryTextFilter: () => {},

  queryTextFilterForName: '',
  setQueryTextFilterForName: () => {},
  queryTextFilterForCreator: '',
  setQueryTextFilterForCreator: () => {},

  assetType: 'All',
  setAssetType: () => {},

  categoryFilter: [],
  setCategoryFilter: () => {},

  tagFilter: [],
  setTagFilter: () => {},
  tagFilterMatchType: 'OR',
  setTagFilterMatchType: () => {},

  supportedAvatarFilter: [],
  setSupportedAvatarFilter: () => {},
  supportedAvatarFilterMatchType: 'OR',
  setSupportedAvatarFilterMatchType: () => {},

  clearFilters: () => {},
})

type Props = {
  children: React.ReactNode
}

const PersistentContextProvider: FC<Props> = ({ children }) => {
  const { persistentContextValue } = usePersistentContext()

  return (
    <PersistentContext.Provider value={persistentContextValue}>
      {children}
    </PersistentContext.Provider>
  )
}

export default PersistentContextProvider
