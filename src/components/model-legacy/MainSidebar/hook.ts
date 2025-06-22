import { AssetContext } from '@/components/context/AssetContext'
import { PersistentContext } from '@/components/context/PersistentContext'
import { Option } from '@/components/ui/multi-select'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fetchAllTags } from './logic'
import { AssetType, MatchType } from '@/lib/bindings'

type ReturnProps = {
  textSearchMode: 'general' | 'advanced'
  setTextSearchMode: (mode: 'general' | 'advanced') => void
  generalQueryTextFilter: string
  setGeneralQueryTextFilter: (filter: string) => void
  queryTextFilterForName: string
  setQueryTextFilterForName: (filter: string) => void
  queryTextFilterForCreator: string
  setQueryTextFilterForCreator: (filter: string) => void

  filteredAssetType: AssetType | 'All'

  tagCandidates: Option[]
  tagValues: string[]
  setTagFilter: (filter: string[]) => void
  tagFilterMatchType: MatchType
  setTagFilterMatchType: (matchType: MatchType) => void
  tagSelectorInputProps: {
    onFocus: () => void
    onBlur: () => void
  }
}

export const useMainSidebar = (): ReturnProps => {
  const { assetDisplaySortedList, filteredIds } = useContext(AssetContext)
  const {
    assetType,
    queryTextMode,
    setQueryTextMode,
    generalQueryTextFilter,
    setGeneralQueryTextFilter,
    queryTextFilterForName,
    setQueryTextFilterForName,
    queryTextFilterForCreator,
    setQueryTextFilterForCreator,
    tagFilter,
    setTagFilter,
    tagFilterMatchType,
    setTagFilterMatchType,
  } = useContext(PersistentContext)

  const [tagCandidates, setTagCandidates] = useState<Option[]>([])
  const [tagSelectorFocused, setTagSelectorFocused] = useState(false)

  const updateTagCandidates = useCallback(async () => {
    setTagCandidates(await fetchAllTags(filteredIds))
  }, [filteredIds])

  useEffect(() => {
    if (!tagSelectorFocused) {
      updateTagCandidates()
    }
  }, [assetDisplaySortedList, tagSelectorFocused, updateTagCandidates])

  return {
    textSearchMode: queryTextMode,
    setTextSearchMode: setQueryTextMode,
    generalQueryTextFilter,
    setGeneralQueryTextFilter,
    queryTextFilterForName,
    setQueryTextFilterForName,
    queryTextFilterForCreator,
    setQueryTextFilterForCreator,

    filteredAssetType: assetType,

    tagCandidates,
    tagValues: tagFilter,
    setTagFilter,
    tagFilterMatchType,
    setTagFilterMatchType,

    tagSelectorInputProps: {
      onFocus: () => setTagSelectorFocused(true),
      onBlur: () => setTagSelectorFocused(false),
    },
  }
}
