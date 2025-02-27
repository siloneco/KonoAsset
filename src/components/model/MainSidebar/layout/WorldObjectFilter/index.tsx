import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext } from 'react'
import { fetchAllCategories } from './logic'
import MultiFilterItemSelector from '@/components/model/MainSidebar/components/MultiFilterItemSelector'
import { PersistentContext } from '@/components/context/PersistentContext'
import { useLocalization } from '@/hooks/use-localization'

const WorldObjectFilter = () => {
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const { categoryFilter, setCategoryFilter } = useContext(PersistentContext)
  const { t } = useLocalization()

  const categoryValues: Option[] = categoryFilter.map((category) => ({
    value: category,
    label: category,
  }))

  const updateCategoriesAndTags = async () => {
    setCategoryCandidates(await fetchAllCategories())
  }

  useEffect(() => {
    updateCategoriesAndTags()
  }, [])

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
      />
    </div>
  )
}

export default WorldObjectFilter
