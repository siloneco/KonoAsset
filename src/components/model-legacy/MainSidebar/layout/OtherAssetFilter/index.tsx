import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useCallback } from 'react'
import { fetchAllCategories } from './logic'
import { MultiFilterItemSelector } from '@/components/model-legacy/MainSidebar/components/MultiFilterItemSelector'
import { useLocalization } from '@/hooks/use-localization'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'
import { useShallow } from 'zustand/react/shallow'
import { useAssetFilterStore } from '@/stores/AssetFilterStore'

export const OtherAssetFilter = () => {
  const { t } = useLocalization()
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [isCategoryFocused, setIsCategoryFocused] = useState(false)

  const sortedAssetSummaries = useAssetSummaryViewStore(
    (state) => state.sortedAssetSummaries,
  )

  const { filteredIds, filters, updateFilter } = useAssetFilterStore(
    useShallow((state) => ({
      filteredIds: state.filteredIds,
      filters: state.filters,
      updateFilter: state.updateFilter,
    })),
  )

  const updateCategoriesAndTags = useCallback(async () => {
    if (!isCategoryFocused) {
      setCategoryCandidates(await fetchAllCategories(filteredIds))
    }
  }, [filteredIds, isCategoryFocused])

  useEffect(() => {
    updateCategoriesAndTags()
  }, [sortedAssetSummaries, updateCategoriesAndTags])

  return (
    <div className="mt-4 space-y-4">
      <MultiFilterItemSelector
        label={t('general:category')}
        placeholder={t('mainsidebar:filter:category:placeholder')}
        candidates={categoryCandidates}
        value={filters.category}
        onValueChange={(value) =>
          updateFilter({
            category: value,
          })
        }
        inputProps={{
          onFocus: () => setIsCategoryFocused(true),
          onBlur: () => setIsCategoryFocused(false),
        }}
      />
    </div>
  )
}
