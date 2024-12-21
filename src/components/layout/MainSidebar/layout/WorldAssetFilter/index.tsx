import { AssetFilterContext } from '@/components/context/AssetFilterContext'
import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext } from 'react'
import { fetchAllCategories } from './logic'
import MultiFilterItemSelector from '@/components/model/MultiFilterItemSelector'

const WorldAssetFilter = () => {
  const { setCategoryFilter } = useContext(AssetFilterContext)

  const [categories, setCategories] = useState<Option[]>([])

  const updateCategoriesAndTags = async () => {
    setCategories(await fetchAllCategories())
  }

  useEffect(() => {
    updateCategoriesAndTags()
  }, [])

  return (
    <div className="mt-4 space-y-4">
      <MultiFilterItemSelector
        label="カテゴリ"
        placeholder="絞り込むカテゴリを選択..."
        candidates={categories}
        onValueChange={(values) =>
          setCategoryFilter(values.map((v) => v.value))
        }
      />
    </div>
  )
}

export default WorldAssetFilter
