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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useContext } from 'react'

type Props = {
  submitting: boolean
}

const WorldLayout = ({ submitting }: Props) => {
  const { form } = useContext(AddAssetModalContext)

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
                <Select
                  onValueChange={(value) => {
                    form.setValue('category', value)
                  }}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="hair">髪</SelectItem>
                      <SelectItem value="costume">衣装</SelectItem>
                      <SelectItem value="accessory">アクセサリ</SelectItem>
                      <SelectItem value="halo">ヘイロー</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormDescription>
                  カテゴリはアセットの絞り込みや分類に利用されます
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
    </div>
  )
}

export default WorldLayout
