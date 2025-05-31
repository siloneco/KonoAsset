import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext, useCallback } from 'react'
import { fetchAllCategories } from './logic'
import { MultiFilterItemSelector } from '@/components/model/MainSidebar/components/MultiFilterItemSelector'
import { useLocalization } from '@/hooks/use-localization'
import { useAssetSummaryStore } from '@/stores/AssetSummaryStore'
import { AssetFilterContext } from '@/components/functional/AssetFilterContext'

export const WorldObjectFilter = () => {
  const { t } = useLocalization()
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [isCategoryFocused, setIsCategoryFocused] = useState(false)

  const { sortedAssetSummaries } = useAssetSummaryStore()
  const { matchedAssetIds, categoryFilter, updateFilter } =
    useContext(AssetFilterContext)

  const categoryValues: Option[] = categoryFilter.map((category) => ({
    value: category,
    label: category,
  }))

  const updateCategoriesAndTags = useCallback(async () => {
    if (!isCategoryFocused) {
      setCategoryCandidates(await fetchAllCategories(matchedAssetIds))
    }
  }, [matchedAssetIds, isCategoryFocused])

  useEffect(() => {
    updateCategoriesAndTags()
  }, [sortedAssetSummaries, updateCategoriesAndTags])

  return (
    <div className="mt-4 space-y-4">
      <MultiFilterItemSelector
        label={t('general:category')}
        placeholder={t('mainsidebar:filter:category:placeholder')}
        candidates={categoryCandidates}
        value={categoryValues}
        onValueChange={(values) =>
          updateFilter({ categoryFilter: values.map((v) => v.value) })
        }
        inputProps={{
          onFocus: () => setIsCategoryFocused(true),
          onBlur: () => setIsCategoryFocused(false),
        }}
      />
    </div>
  )
}
