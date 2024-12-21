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

import { useContext } from 'react'

type Props = {
  submitting: boolean
}

const AvatarLayout = ({ submitting }: Props) => {
  const { form } = useContext(AddAssetModalContext)

  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full flex flex-row space-x-2">
      <div className="w-full">
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

export default AvatarLayout
