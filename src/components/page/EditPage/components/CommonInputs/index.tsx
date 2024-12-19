import TagList from '@/components/model/TagList'
import TagPicker from '@/components/model/TagPicker'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { invoke } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'
import { downloadDir } from '@tauri-apps/api/path'
import { ImagePlus } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import ImageWrapper from '../ImageWrapper'
import { AssetType } from '@/lib/entity'

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
}

const CommonInputs = ({ form, disabled }: Props) => {
  const openImageSelector = async () => {
    const path = await open({
      multiple: false,
      directory: false,
      defaultPath: await downloadDir(),
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }],
    })

    if (path === null) {
      return
    }

    const result: string = await invoke('copy_image_file_to_images', { path })
    form.setValue('image_src', result)
  }

  const imageSrc = form.watch('image_src')

  return (
    <div className="w-full flex flex-row space-x-6 mt-8">
      <div className="w-2/5">
        <AspectRatio
          ratio={1}
          className="w-full flex items-center bg-white rounded-lg overflow-hidden"
        >
          <ImageWrapper src={imageSrc} />
          <div
            className="absolute top-0 left-0 h-full w-full rounded-lg flex justify-center items-center opacity-0 bg-black text-white transition-all cursor-pointer hover:opacity-100 hover:bg-opacity-30 dark:hover:opacity-100 dark:hover:bg-opacity-50"
            onClick={openImageSelector}
          >
            <ImagePlus size={50} />
          </div>
        </AspectRatio>
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
