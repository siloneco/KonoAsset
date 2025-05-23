import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext, useCallback } from 'react'
import { fetchAllCategories } from './logic'
import { MultiFilterItemSelector } from '@/components/model/MainSidebar/components/MultiFilterItemSelector'
import { PersistentContext } from '@/components/context/PersistentContext'
import { useLocalization } from '@/hooks/use-localization'
import { AssetContext } from '@/components/context/AssetContext'

export const WorldObjectFilter = () => {
  const { t } = useLocalization()
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [isCategoryFocused, setIsCategoryFocused] = useState(false)

  const { assetDisplaySortedList, filteredIds } = useContext(AssetContext)
  const { categoryFilter, setCategoryFilter } = useContext(PersistentContext)

  const categoryValues: Option[] = categoryFilter.map((category) => ({
    value: category,
    label: category,
  }))

  const updateCategoriesAndTags = useCallback(async () => {
    if (!isCategoryFocused) {
      setCategoryCandidates(await fetchAllCategories(filteredIds))
    }
  }, [filteredIds, isCategoryFocused])

  useEffect(() => {
    updateCategoriesAndTags()
  }, [assetDisplaySortedList, updateCategoriesAndTags])

  return (
    <div className="mt-4 space-y-4">
      <MultiFilterItemSelector
        label={t('general:category')}
        placeholder={t('mainsidebar:filter:category:placeholder')}
        candidates={categoryCandidates}
        value={categoryValues}
        onValueChange={(values) =>
          setCategoryFilter(values.map((v) => v.value))
        }
        inputProps={{
          onFocus: () => setIsCategoryFocused(true),
          onBlur: () => setIsCategoryFocused(false),
        }}
      />
    </div>
  )
}
