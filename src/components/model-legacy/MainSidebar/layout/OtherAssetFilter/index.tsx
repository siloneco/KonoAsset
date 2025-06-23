import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext, useCallback } from 'react'
import { fetchAllCategories } from './logic'
import { MultiFilterItemSelector } from '@/components/model-legacy/MainSidebar/components/MultiFilterItemSelector'
import { PersistentContext } from '@/components/context/PersistentContext'
import { useLocalization } from '@/hooks/use-localization'
import { AssetContext } from '@/components/context/AssetContext'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'

export const OtherAssetFilter = () => {
  const { t } = useLocalization()
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [isCategoryFocused, setIsCategoryFocused] = useState(false)

  const { filteredIds } = useContext(AssetContext)
  const { categoryFilter, setCategoryFilter } = useContext(PersistentContext)

  const sortedAssetSummaries = useAssetSummaryViewStore(
    (state) => state.sortedAssetSummaries,
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
        value={categoryFilter}
        onValueChange={setCategoryFilter}
        inputProps={{
          onFocus: () => setIsCategoryFocused(true),
          onBlur: () => setIsCategoryFocused(false),
        }}
      />
    </div>
  )
}
