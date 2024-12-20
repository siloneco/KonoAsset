import TagList from '@/components/model/TagList'
import TagPicker from '@/components/model/TagPicker'
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
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >
  disabled: boolean
}

const CommonInputs = ({ form, disabled }: Props) => {
  const imageSrc = form.watch('image_src')

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
                    disabled={disabled}
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

export default CommonInputs
