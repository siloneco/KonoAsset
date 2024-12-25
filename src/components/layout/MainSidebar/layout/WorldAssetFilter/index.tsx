import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext } from 'react'
import { fetchAllCategories } from './logic'
import MultiFilterItemSelector from '@/components/model/MultiFilterItemSelector'
import { PersistentContext } from '@/components/context/PersistentContext'

const WorldAssetFilter = () => {
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const { categoryFilter, setCategoryFilter } = useContext(PersistentContext)

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
        label="カテゴリ"
        placeholder="絞り込むカテゴリを選択..."
        candidates={categoryCandidates}
        value={categoryValues}
        onValueChange={(values) =>
          setCategoryFilter(values.map((v) => v.value))
        }
      />
    </div>
  )
}

export default WorldAssetFilter
