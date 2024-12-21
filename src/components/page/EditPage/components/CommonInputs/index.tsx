import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { AssetType } from '@/lib/entity'
import ImagePicker from '@/components/model/ImagePicker'
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { invoke } from '@tauri-apps/api/core'
import { useState, useEffect } from 'react'

type Props = {
  form: UseFormReturn<
    {
      assetType: AssetType
      title: string
      author: string
      image_src: string
      booth_url: string | null
      tags: string[]
      category: string
      supportedAvatars: string[]
      published_at: number | null
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >
  disabled: boolean
}

const CommonInputs = ({ form, disabled }: Props) => {
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  const fetchTagCandidates = async () => {
    const result: string[] = await invoke('get_all_asset_tags')
    setTagCandidates(result.map((value) => ({ label: value, value })))
  }

  useEffect(() => {
    fetchTagCandidates()
  }, [])

  const imageSrc = form.watch('image_src')
  const tags = form.watch('tags')

  return (
    <div className="w-full flex flex-row space-x-6 mt-8">
      <div className="w-2/5">
        <ImagePicker
          path={imageSrc}
          setPath={(path) => form.setValue('image_src', path)}
        />
      </div>
      <div className="w-3/5 space-y-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>アセット名</FormLabel>
              <FormControl>
                <Input
                  placeholder="アセットの名前を入力..."
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                アセット名は一覧表示の際に表示されます
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ショップ名</FormLabel>
              <FormControl>
                <Input
                  placeholder="ショップの名前を入力..."
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                ショップ名は一覧表示の際に表示されます
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  className="bg-background"
                  disabled={disabled}
                  value={tags.map((tag) => ({ label: tag, value: tag }))}
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

export default CommonInputs
