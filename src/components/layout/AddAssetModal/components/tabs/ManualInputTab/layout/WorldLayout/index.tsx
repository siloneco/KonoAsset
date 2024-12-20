import { AddAssetModalContext } from '@/components/layout/AddAssetModal'
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'

import { Separator } from '@/components/ui/separator'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import TextInputSelect from '@/components/ui/text-input-select'
import MultipleSelector, { Option } from '@/components/ui/multi-select'

type Props = {
  submitting: boolean
}

const WorldLayout = ({ submitting }: Props) => {
  const { form } = useContext(AddAssetModalContext)
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  const fetchExistingCategories = async () => {
    const result: string[] = await invoke('get_world_categories')
    setCategoryCandidates(result.map((value) => ({ label: value, value })))
  }

  const fetchTagCandidates = async () => {
    const result: string[] = await invoke('get_all_asset_tags')
    setTagCandidates(result.map((value) => ({ label: value, value })))
  }

  useEffect(() => {
    fetchExistingCategories()
    fetchTagCandidates()
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
                <TextInputSelect
                  options={categoryCandidates}
                  placeholder="カテゴリを選択..."
                  disabled={submitting}
                  creatable
                  emptyIndicator={
                    <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
                      入力して作成
                    </p>
                  }
                  onChange={(value) => {
                    form.setValue('category', value?.value as string)
                  }}
                />
                <FormDescription>
                  カテゴリはアセットの絞り込みに利用されます
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
          render={() => {
            return (
              <FormItem>
                <FormLabel>タグ</FormLabel>
                <MultipleSelector
                  options={tagCandidates}
                  placeholder="タグを選択..."
                  disabled={submitting}
                  hidePlaceholderWhenSelected
                  creatable
                  emptyIndicator={
                    <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
                      入力して作成
                    </p>
                  }
                  onChange={(value) => {
                    form.setValue(
                      'tags',
                      value.map((v) => v.value),
                    )
                  }}
                />
                <FormDescription>
                  タグはアセットの絞り込みに利用されます
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
