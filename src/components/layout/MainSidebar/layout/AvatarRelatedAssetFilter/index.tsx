import { AssetFilterContext } from '@/components/context/AssetFilterContext'
import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext } from 'react'
import {
  fetchAllCategories,
  fetchAllSupportedAvatars,
  fetchAllTags,
} from './logic'
import { MatchType } from '@/lib/entity'

const AvatarRelatedAssetFilter = () => {
  const [categories, setCategories] = useState<Option[]>([])
  const [supportedAvatars, setSupportedAvatars] = useState<Option[]>([])
  const [tags, setTags] = useState<Option[]>([])

  const {
    setCategoryFilter,
    setTagFilter,
    setSupportedAvatarFilter,
    categoryFilterMatchType,
    setCategoryFilterMatchType,
    supportedAvatarFilterMatchType,
    setSupportedAvatarFilterMatchType,
    tagFilterMatchType,
    setTagFilterMatchType,
  } = useContext(AssetFilterContext)

  const updateCategoriesAndTags = async () => {
    setTags(await fetchAllTags())
    setSupportedAvatars(await fetchAllSupportedAvatars())
    setCategories(await fetchAllCategories())
  }

  useEffect(() => {
    updateCategoriesAndTags()
  }, [])

  const toggle = (matchType: MatchType) => {
    if (matchType === MatchType.AND) {
      return MatchType.OR
    }
    return MatchType.AND
  }

  return (
    <div className="mt-4 space-y-4">
      <div>
        <div className="flex flex-row">
          <Label className="text-base w-full">カテゴリ</Label>
          <div
            className="space-x-2 bg-primary text-primary-foreground px-4 rounded-full text-[12px] flex items-center cursor-pointer select-none"
            onClick={() =>
              setCategoryFilterMatchType(toggle(categoryFilterMatchType))
            }
          >
            <span>{categoryFilterMatchType}</span>
          </div>
        </div>
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
        <div className="flex flex-row">
          <Label className="text-base w-full">対応アバター</Label>
          <div
            className="space-x-2 bg-primary text-primary-foreground px-4 rounded-full text-[12px] flex items-center cursor-pointer select-none"
            onClick={() =>
              setSupportedAvatarFilterMatchType(
                toggle(supportedAvatarFilterMatchType),
              )
            }
          >
            <span>{supportedAvatarFilterMatchType}</span>
          </div>
        </div>
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
        <div className="flex flex-row">
          <Label className="text-base w-full">タグ</Label>
          <div
            className="space-x-2 bg-primary text-primary-foreground px-4 rounded-full text-[12px] flex items-center cursor-pointer select-none"
            onClick={() => setTagFilterMatchType(toggle(tagFilterMatchType))}
          >
            <span>{tagFilterMatchType}</span>
          </div>
        </div>
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
