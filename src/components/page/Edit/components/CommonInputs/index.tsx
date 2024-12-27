import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import SquareImage from '@/components/model/SquareImage'
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { useState, useEffect } from 'react'
import { AssetFormType } from '@/lib/form'
import { commands } from '@/lib/bindings'

type Props = {
  form: AssetFormType
  disabled: boolean
}

const CommonInputs = ({ form, disabled }: Props) => {
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  const fetchTagCandidates = async () => {
    const result = await commands.getAllAssetTags()

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    setTagCandidates(result.data.map((value) => ({ label: value, value })))
  }

  useEffect(() => {
    fetchTagCandidates()
  }, [])

  const assetType = form.watch('assetType')
  const imagePath = form.watch('imagePath')
  const tags = form.watch('tags')

  return (
    <div className="w-full flex flex-row space-x-6 mt-8">
      <div className="w-2/5">
        <SquareImage
          assetType={assetType}
          path={imagePath ?? undefined}
          selectable
          setPath={(path) => form.setValue('imagePath', path)}
        />
      </div>
      <div className="w-3/5 space-y-2">
        <FormField
          control={form.control}
          name="name"
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="creator"
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
                  className="bg-background max-w-[435px]"
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

export default CommonInputs
