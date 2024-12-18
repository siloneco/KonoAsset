import CategorySelector from '@/components/layout/AddAssetModal/components/tabs/ManualInputTab/components/CategorySelector'
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { AssetType } from '@/lib/entity'
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
  categoryCandidates: string[]
  addNewCategoryCandidates: (value: string) => void
}

const WorldInputs = ({
  form,
  disabled,
  categoryCandidates,
  addNewCategoryCandidates,
}: Props) => {
  const categoryValue = form.watch('category')

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

export default WorldInputs
