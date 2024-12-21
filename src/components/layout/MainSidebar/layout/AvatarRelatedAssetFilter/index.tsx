import { AssetFilterContext } from '@/components/context/AssetFilterContext'
import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext } from 'react'
import { fetchAllCategories, fetchAllSupportedAvatars } from './logic'
import MultiFilterItemSelector from '@/components/model/MultiFilterItemSelector'

const AvatarRelatedAssetFilter = () => {
  const [categories, setCategories] = useState<Option[]>([])
  const [supportedAvatars, setSupportedAvatars] = useState<Option[]>([])

  const {
    setCategoryFilter,
    setSupportedAvatarFilter,
    supportedAvatarFilterMatchType,
    setSupportedAvatarFilterMatchType,
  } = useContext(AssetFilterContext)

  const updateCategoriesAndTags = async () => {
    setSupportedAvatars(await fetchAllSupportedAvatars())
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
        label="対応アバター"
        placeholder="対応アバターを選択..."
        candidates={supportedAvatars}
        onValueChange={(values) =>
          setSupportedAvatarFilter(values.map((v) => v.value))
        }
        matchType={supportedAvatarFilterMatchType}
        setMatchType={setSupportedAvatarFilterMatchType}
      />
    </div>
  )
}

export default AvatarRelatedAssetFilter
