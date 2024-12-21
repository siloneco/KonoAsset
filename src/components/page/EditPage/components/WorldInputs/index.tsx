import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Option } from '@/components/ui/multi-select'
import TextInputSelect from '@/components/ui/text-input-select'
import { AssetType } from '@/lib/entity'
import { UseFormReturn } from 'react-hook-form'

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
  categoryCandidates: Option[]
}

const WorldInputs = ({ form, disabled, categoryCandidates }: Props) => {
  const categoryValueAsStr = form.watch('category')

  const categoryValue: Option | undefined =
    categoryValueAsStr === ''
      ? undefined
      : { label: categoryValueAsStr, value: categoryValueAsStr }

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
                  <FormLabel>カテゴリ</FormLabel>
                  <TextInputSelect
                    options={categoryCandidates}
                    placeholder="カテゴリを選択..."
                    className="bg-background"
                    disabled={disabled}
                    value={categoryValue}
                    creatable
                    emptyIndicator={
                      <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
                        入力して作成
                      </p>
                    }
                    onChange={(value) => {
                      if (value === null) {
                        form.setValue('category', '')
                      } else {
                        form.setValue('category', value?.value as string)
                      }
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
    </>
  )
}

export default WorldInputs
