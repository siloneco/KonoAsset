import { AssetType, MatchType, SortBy } from '@/lib/entity'
import { useState } from 'react'
import { PersistentContextType } from '.'

type ReturnProps = {
  persistentContextValue: PersistentContextType
}

export const usePersistentContext = (): ReturnProps => {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.CreatedAt)
  const [reverseOrder, setReverseOrder] = useState(true)

  const [textFilter, setTextFilter] = useState('')
  const [assetType, setAssetType] = useState<AssetType | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [supportedAvatarFilter, setSupportedAvatarFilter] = useState<string[]>(
    [],
  )

  const [tagFilterMatchType, setTagFilterMatchType] = useState(MatchType.OR)
  const [supportedAvatarFilterMatchType, setSupportedAvatarFilterMatchType] =
    useState(MatchType.OR)

  const [editingAssetID, setEditingAssetID] = useState<string | null>(null)

  const clearFilters = () => {
    setTextFilter('')
    setAssetType('all')
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

    editingAssetID,
    setEditingAssetID,
  }

  return { persistentContextValue }
}
