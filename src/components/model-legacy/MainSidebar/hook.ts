import { Option } from '@/components/ui/multi-select'
import { useCallback, useEffect, useState } from 'react'
import { fetchAllTags } from './logic'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'
import { useAssetFilterStore } from '@/stores/AssetFilterStore'

type ReturnProps = {
  tagCandidates: Option[]
  tagSelectorInputProps: {
    onFocus: () => void
    onBlur: () => void
  }
}

export const useMainSidebar = (): ReturnProps => {
  const filteredIds = useAssetFilterStore((state) => state.filteredIds)
  const sortedAssetSummaries = useAssetSummaryViewStore(
    (state) => state.sortedAssetSummaries,
  )

  const [tagCandidates, setTagCandidates] = useState<Option[]>([])
  const [tagSelectorFocused, setTagSelectorFocused] = useState(false)

  const updateTagCandidates = useCallback(async () => {
    setTagCandidates(await fetchAllTags(filteredIds))
  }, [filteredIds])

  useEffect(() => {
    if (!tagSelectorFocused) {
      updateTagCandidates()
    }
  }, [sortedAssetSummaries, tagSelectorFocused, updateTagCandidates])

  return {
    tagCandidates,
    tagSelectorInputProps: {
      onFocus: () => setTagSelectorFocused(true),
      onBlur: () => setTagSelectorFocused(false),
    },
  }
}
