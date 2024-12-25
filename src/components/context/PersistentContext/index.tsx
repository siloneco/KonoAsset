import { AssetType, MatchType, SortBy } from '@/lib/entity'
import { createContext, FC } from 'react'
import { usePersistentContext } from './hook'

export type PersistentContextType = {
  sortBy: SortBy
  setSortBy: (sortBy: SortBy) => void
  reverseOrder: boolean
  setReverseOrder: (reverseOrder: boolean) => void

  textFilter: string
  setTextFilter: (filter: string) => void

  assetType: AssetType | 'all'
  setAssetType: (type: AssetType | 'all') => void

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
  sortBy: SortBy.Title,
  setSortBy: () => {},
  reverseOrder: false,
  setReverseOrder: () => {},

  textFilter: '',
  setTextFilter: () => {},

  assetType: 'all',
  setAssetType: () => {},

  categoryFilter: [],
  setCategoryFilter: () => {},

  tagFilter: [],
  setTagFilter: () => {},
  tagFilterMatchType: MatchType.OR,
  setTagFilterMatchType: () => {},

  supportedAvatarFilter: [],
  setSupportedAvatarFilter: () => {},
  supportedAvatarFilterMatchType: MatchType.OR,
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
