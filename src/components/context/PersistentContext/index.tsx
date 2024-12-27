import { createContext, FC } from 'react'
import { usePersistentContext } from './hook'
import { AssetType, MatchType, SortBy } from '@/lib/bindings'

export type PersistentContextType = {
  sortBy: SortBy
  setSortBy: (sortBy: SortBy) => void
  reverseOrder: boolean
  setReverseOrder: (reverseOrder: boolean) => void

  textFilter: string
  setTextFilter: (filter: string) => void

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

  editingAssetID: string | null
  setEditingAssetID: (assetID: string | null) => void
}

export const PersistentContext = createContext<PersistentContextType>({
  sortBy: 'CreatedAt',
  setSortBy: () => {},
  reverseOrder: false,
  setReverseOrder: () => {},

  textFilter: '',
  setTextFilter: () => {},

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

  editingAssetID: null,
  setEditingAssetID: () => {},
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
