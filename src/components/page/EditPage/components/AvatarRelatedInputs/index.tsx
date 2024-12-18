import CategorySelector from '@/components/layout/AddAssetModal/components/tabs/ManualInputTab/components/CategorySelector'
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { Separator } from '@/components/ui/separator'
import { AssetType } from '@/lib/entity'
import { cn } from '@/lib/utils'
import { UseFormReturn } from 'react-hook-form'

type Props = {
  form: UseFormReturn<
    {
      assetType: AssetType
      title: string
      author: string
      image_src: string
      tags: string[]
      category: string
      supportedAvatars: string[]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >
  disabled: boolean
  supportedAvatarCandidates: Option[]
  categoryCandidates: string[]
  addNewCategoryCandidates: (value: string) => void
}

const AvatarRelatedInputs = ({
  form,
  disabled,
  supportedAvatarCandidates,
  categoryCandidates,
  addNewCategoryCandidates,
}: Props) => {
  const categoryValue = form.watch('category')
  const supportedAvatarsValue = form.watch('supportedAvatars')

  return (
    <>
      <div className="w-full flex flex-row space-x-2">
        <div className="w-1/2">
          <FormField
            control={form.control}
            name="supportedAvatars"
            render={() => {
              return (
                <FormItem>
                  <FormLabel>対応アバター</FormLabel>
                  <MultipleSelector
                    options={supportedAvatarCandidates}
                    placeholder="対応アバターを選択..."
                    className={cn('bg-background', disabled && 'opacity-50')}
                    hidePlaceholderWhenSelected
                    creatable
                    disabled={disabled}
                    emptyIndicator={
                      <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
                        入力して作成
                      </p>
                    }
                    onChange={(value) =>
                      form.setValue(
                        'supportedAvatars',
                        value.map((v) => v.value),
                      )
                    }
                    value={supportedAvatarsValue.map((v) => ({
                      label: v,
                      value: v,
                    }))}
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
                    value={categoryValue}
                    onValueChange={(value) => {
                      form.setValue('category', value)
                    }}
                    categoryCandidates={categoryCandidates}
                    addNewCategory={addNewCategoryCandidates}
                    submitting={disabled}
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
    </>
  )
}

export default AvatarRelatedInputs
