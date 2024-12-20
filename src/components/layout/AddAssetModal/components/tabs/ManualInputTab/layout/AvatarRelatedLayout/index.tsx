import { AddAssetModalContext } from '@/components/layout/AddAssetModal'
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import MultipleSelector, { Option } from '@/components/ui/multi-select'

import { Separator } from '@/components/ui/separator'
import TextInputSelect from '@/components/ui/text-input-select'
import { invoke } from '@tauri-apps/api/core'
import { useContext, useEffect, useState } from 'react'

type Props = {
  submitting: boolean
}

const AvatarRelatedLayout = ({ submitting }: Props) => {
  const { form, setSupportedAvatars } = useContext(AddAssetModalContext)
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    Option[]
  >([])
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  const fetchSupportedAvatars = async () => {
    const result: string[] = await invoke('get_all_supported_avatar_values')

    const options = result.map((value) => {
      return { label: value, value }
    })

    setSupportedAvatarCandidates(options)
  }

  const fetchExistingCategories = async () => {
    const result: string[] = await invoke('get_avatar_related_categories')
    setCategoryCandidates(result.map((value) => ({ label: value, value })))
  }

  const fetchTagCandidates = async () => {
    const result: string[] = await invoke('get_all_asset_tags')
    setTagCandidates(result.map((value) => ({ label: value, value })))
  }

  useEffect(() => {
    fetchSupportedAvatars()
    fetchExistingCategories()
    fetchTagCandidates()
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
                    disabled={submitting}
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
      </div>
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
    </>
  )
}

export default AvatarRelatedLayout
