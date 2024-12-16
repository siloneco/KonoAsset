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
import MultipleSelector, { Option } from '@/components/ui/multi-select'

import { Separator } from '@/components/ui/separator'
import { invoke } from '@tauri-apps/api/core'
import { useContext, useEffect, useState } from 'react'
import CategorySelector from '../../components/CategorySelector'

type Props = {
  submitting: boolean
}

const AvatarRelatedLayout = ({ submitting }: Props) => {
  const { form, setSupportedAvatars } = useContext(AddAssetModalContext)
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    Option[]
  >([])
  const [categoryCandidates, setCategoryCandidates] = useState<string[]>([])

  const fetchSupportedAvatars = async () => {
    const result: string[] = await invoke('get_all_supported_avatar_values')

    const options = result.map((value) => {
      return { label: value, value }
    })

    setSupportedAvatarCandidates(options)
  }

  const fetchExistingCategories = async () => {
    const result: string[] = await invoke('get_avatar_related_categories')
    setCategoryCandidates(result)
  }

  useEffect(() => {
    fetchSupportedAvatars()
    fetchExistingCategories()
  }, [])

  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="w-full flex flex-row space-x-2">
        <div className="w-1/2">
          <FormField
            control={form.control}
            name="category"
            render={() => {
              return (
                <FormItem>
                  <FormLabel>対応アバター</FormLabel>
                  <MultipleSelector
                    options={supportedAvatarCandidates}
                    placeholder="対応アバターを選択..."
                    hidePlaceholderWhenSelected
                    creatable
                    emptyIndicator={
                      <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
                        入力して作成
                      </p>
                    }
                    onChange={(value) => {
                      setSupportedAvatars(value.map((v) => v.value))
                    }}
                  />
                  <FormDescription>
                    対応アバターはアセットの絞り込みに利用されます
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
      </div>
      <div className="w-full">
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
    </>
  )
}

export default AvatarRelatedLayout
