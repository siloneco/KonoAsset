import { AddAssetModalContext } from '@/components/layout/AddAssetModal'
import TagList from '@/components/model/TagList'
import TagPicker from '@/components/model/TagPicker'
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'

import { Separator } from '@/components/ui/separator'
import { useContext } from 'react'
import CategorySelector from '../../components/CategorySelector'
import { useState } from 'react'
import { useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'

type Props = {
  submitting: boolean
}

const WorldLayout = ({ submitting }: Props) => {
  const { form } = useContext(AddAssetModalContext)
  const [categoryCandidates, setCategoryCandidates] = useState<string[]>([])

  const fetchExistingCategories = async () => {
    const result: string[] = await invoke('get_world_categories')
    setCategoryCandidates(result)
  }

  useEffect(() => {
    fetchExistingCategories()
  }, [])

  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full flex flex-row space-x-2">
      <div className="w-1/2">
        <FormField
          control={form.control}
          name="category"
          render={() => {
            return (
              <FormItem>
                <FormLabel>カテゴリ</FormLabel>
                <CategorySelector
                  onValueChange={(value) => {
                    form.setValue('category', value)
                  }}
                  categoryCandidates={categoryCandidates}
                  addNewCategory={(value) => {
                    setCategoryCandidates((prev) => [...prev, value])
                  }}
                  submitting={submitting}
                />
                <FormDescription>
                  カテゴリはアセットの絞り込みや分類に利用されます
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </div>
      <Separator orientation="vertical" className="h-32 my-auto" />
      <div className="w-1/2">
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => {
            if (field.value === undefined) {
              form.setValue('tags', [])
              field.value = []
            }

            return (
              <FormItem>
                <FormLabel>タグ</FormLabel>
                <TagList tags={field.value || []}>
                  <TagPicker
                    tags={field.value || []}
                    setTags={(tags) => form.setValue('tags', tags)}
                    disabled={submitting}
                    className="mb-2 mr-2"
                  />
                </TagList>
                <FormDescription>
                  タグはアセットの絞り込みや分類に利用されます
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </div>
    </div>
  )
}

export default WorldLayout
