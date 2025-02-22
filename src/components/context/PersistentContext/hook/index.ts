import { useState } from 'react'
import { PersistentContextType } from '..'
import { AssetType, MatchType, SortBy } from '@/lib/bindings'

type ReturnProps = {
  persistentContextValue: PersistentContextType
}

export const usePersistentContext = (): ReturnProps => {
  const [sortBy, setSortBy] = useState<SortBy>('CreatedAt')
  const [reverseOrder, setReverseOrder] = useState(true)

  const [textFilter, setTextFilter] = useState('')
  const [assetType, setAssetType] = useState<AssetType | 'All'>('All')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [supportedAvatarFilter, setSupportedAvatarFilter] = useState<string[]>(
    [],
  )

  const [tagFilterMatchType, setTagFilterMatchType] = useState<MatchType>('OR')
  const [supportedAvatarFilterMatchType, setSupportedAvatarFilterMatchType] =
    useState<MatchType>('OR')

  const clearFilters = () => {
    setTextFilter('')
    setAssetType('All')
    setCategoryFilter([])
    setTagFilter([])
    setSupportedAvatarFilter([])
  }

  const persistentContextValue: PersistentContextType = {
    sortBy: sortBy,
    setSortBy: setSortBy,
    reverseOrder: reverseOrder,
    setReverseOrder: setReverseOrder,

    textFilter: textFilter,
    setTextFilter: setTextFilter,

    assetType: assetType,
    setAssetType: setAssetType,

    categoryFilter,
    setCategoryFilter,

    tagFilter,
    setTagFilter,
    tagFilterMatchType,
    setTagFilterMatchType,

    supportedAvatarFilter,
    setSupportedAvatarFilter,
    supportedAvatarFilterMatchType,
    setSupportedAvatarFilterMatchType,

    clearFilters,
  }

  return { persistentContextValue }
}
