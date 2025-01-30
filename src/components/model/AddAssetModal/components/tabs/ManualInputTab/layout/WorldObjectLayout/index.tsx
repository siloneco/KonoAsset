import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'

import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { useEffect } from 'react'
import TextInputSelect from '@/components/ui/text-input-select'
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { AssetFormType } from '@/lib/form'
import { commands } from '@/lib/bindings'

type Props = {
  form: AssetFormType
  submitting: boolean
}

const WorldObjectLayout = ({ form, submitting }: Props) => {
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  const fetchExistingCategories = async () => {
    const result = await commands.getWorldObjectCategories()

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    setCategoryCandidates(result.data.map((value) => ({ label: value, value })))
  }

  const fetchTagCandidates = async () => {
    const result = await commands.getAllAssetTags()

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    setTagCandidates(result.data.map((value) => ({ label: value, value })))
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
                  className="max-w-72"
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
                  カテゴリは1つまで選択できます (例: 衣装、髪など)
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
                  className="max-w-72"
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
                  タグは複数選択できます (例: Vket、無料、自作など)
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

export default WorldObjectLayout
