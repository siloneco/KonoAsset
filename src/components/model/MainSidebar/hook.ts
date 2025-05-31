import { Option } from '@/components/ui/multi-select'
import { useCallback, useContext, useEffect, useState } from 'react'
import { fetchAllTags } from './logic'
import { useAssetSummaryStore } from '@/stores/AssetSummaryStore'
import { AssetFilterContext } from '@/components/functional/AssetFilterContext'

type ReturnProps = {
  tagCandidates: Option[]
  tagValues: Option[]
  tagSelectorInputProps: {
    onFocus: () => void
    onBlur: () => void
  }
}

export const useMainSidebar = (): ReturnProps => {
  const { sortedAssetSummaries } = useAssetSummaryStore()

  const [tagCandidates, setTagCandidates] = useState<Option[]>([])
  const [tagSelectorFocused, setTagSelectorFocused] = useState(false)

  const { matchedAssetIds, tagFilter } = useContext(AssetFilterContext)

  const tagValues: Option[] = tagFilter.map((tag) => ({
    value: tag,
    label: tag,
  }))

  const updateTagCandidates = useCallback(async () => {
    setTagCandidates(await fetchAllTags(matchedAssetIds))
  }, [matchedAssetIds])

  useEffect(() => {
    if (!tagSelectorFocused) {
      updateTagCandidates()
    }
  }, [sortedAssetSummaries, tagSelectorFocused, updateTagCandidates])

  return {
    tagCandidates,
    tagValues,

    tagSelectorInputProps: {
      onFocus: () => setTagSelectorFocused(true),
      onBlur: () => setTagSelectorFocused(false),
    },
  }
}
