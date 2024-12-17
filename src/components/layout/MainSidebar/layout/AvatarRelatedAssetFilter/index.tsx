import { AssetFilterContext } from '@/components/context/AssetFilterContext'
import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext } from 'react'
import {
  fetchAllCategories,
  fetchAllSupportedAvatars,
  fetchAllTags,
} from './logic'

const AvatarRelatedAssetFilter = () => {
  const [categories, setCategories] = useState<Option[]>([])
  const [supportedAvatars, setSupportedAvatars] = useState<Option[]>([])
  const [tags, setTags] = useState<Option[]>([])

  const { setCategoryFilter, setTagFilter, setSupportedAvatarFilter } =
    useContext(AssetFilterContext)

  const updateCategoriesAndTags = async () => {
    setTags(await fetchAllTags())
    setSupportedAvatars(await fetchAllSupportedAvatars())
    setCategories(await fetchAllCategories())
  }

  useEffect(() => {
    updateCategoriesAndTags()
  }, [])

  return (
    <div className="mt-4 space-y-4">
      <div>
        <Label className="text-base">カテゴリ</Label>
        <MultipleSelector
          className="mt-2"
          options={categories}
          onChange={(values) => setCategoryFilter(values.map((v) => v.value))}
          placeholder="絞り込むカテゴリを選択..."
          hidePlaceholderWhenSelected
          emptyIndicator={
            <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
              候補がありません
            </p>
          }
        />
      </div>
      <div>
        <Label className="text-base">対応アバター</Label>
        <MultipleSelector
          className="mt-2"
          options={supportedAvatars}
          onChange={(values) =>
            setSupportedAvatarFilter(values.map((v) => v.value))
          }
          placeholder="対応アバターを選択..."
          hidePlaceholderWhenSelected
          emptyIndicator={
            <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
              候補がありません
            </p>
          }
        />
      </div>
      <div className="h-40">
        <Label className="text-base">タグ</Label>
        <MultipleSelector
          className="mt-2"
          options={tags}
          onChange={(values) => setTagFilter(values.map((v) => v.value))}
          placeholder="絞り込むタグを選択..."
          hidePlaceholderWhenSelected
          emptyIndicator={
            <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
              候補がありません
            </p>
          }
        />
      </div>
    </div>
  )
}

export default AvatarRelatedAssetFilter
