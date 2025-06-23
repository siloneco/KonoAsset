import { useState } from 'react'
import { PersistentContextType } from '..'
import { AssetType, MatchType } from '@/lib/bindings'

type ReturnProps = {
  persistentContextValue: PersistentContextType
}

export const usePersistentContext = (): ReturnProps => {
  const [queryTextMode, setQueryTextMode] = useState<'general' | 'advanced'>(
    'general',
  )

  const [generalTextFilter, setGeneralTextFilter] = useState('')
  const [queryTextFilterForName, setQueryTextFilterForName] = useState('')
  const [queryTextFilterForCreator, setQueryTextFilterForCreator] = useState('')

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
    // setQueryTextMode('general')
    setGeneralTextFilter('')
    setQueryTextFilterForName('')
    setQueryTextFilterForCreator('')
    setAssetType('All')
    setCategoryFilter([])
    setTagFilter([])
    setSupportedAvatarFilter([])
  }

  const persistentContextValue: PersistentContextType = {
    queryTextMode: queryTextMode,
    setQueryTextMode: setQueryTextMode,

    generalQueryTextFilter: generalTextFilter,
    setGeneralQueryTextFilter: setGeneralTextFilter,

    queryTextFilterForName: queryTextFilterForName,
    setQueryTextFilterForName: setQueryTextFilterForName,
    queryTextFilterForCreator: queryTextFilterForCreator,
    setQueryTextFilterForCreator: setQueryTextFilterForCreator,

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
