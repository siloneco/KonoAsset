import { AssetFilterContext } from '@/components/context/AssetFilterContext'
import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext } from 'react'
import { fetchAllCategories, fetchAllTags } from './logic'
import MultiFilterItemSelector from '@/components/model/MultiFilterItemSelector'

const WorldAssetFilter = () => {
  const {
    setCategoryFilter,
    setTagFilter,
    tagFilterMatchType,
    setTagFilterMatchType,
  } = useContext(AssetFilterContext)

  const [tags, setTags] = useState<Option[]>([])
  const [categories, setCategories] = useState<Option[]>([])

  const updateCategoriesAndTags = async () => {
    setTags(await fetchAllTags())
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
      <MultiFilterItemSelector
        label="タグ"
        placeholder="絞り込むタグを選択..."
        candidates={tags}
        onValueChange={(values) => setTagFilter(values.map((v) => v.value))}
        matchType={tagFilterMatchType}
        setMatchType={setTagFilterMatchType}
      />
    </div>
  )
}

export default WorldAssetFilter
