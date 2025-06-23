import { createContext, FC } from 'react'
import { usePersistentContext } from './hook'
import { AssetType, MatchType } from '@/lib/bindings'

export type PersistentContextType = {
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

export const PersistentContextProvider: FC<Props> = ({ children }) => {
  const { persistentContextValue } = usePersistentContext()

  return (
    <PersistentContext.Provider value={persistentContextValue}>
      {children}
    </PersistentContext.Provider>
  )
}
