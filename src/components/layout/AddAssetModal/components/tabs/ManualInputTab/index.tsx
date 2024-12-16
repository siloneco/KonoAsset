import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useContext, useState } from 'react'
import { AddAssetModalContext } from '../../..'
import { useToast } from '@/hooks/use-toast'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import TagPicker from '@/components/model/TagPicker'
import TagList from '@/components/model/TagList'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createPreAsset, sendAssetImportRequest } from './logic'
import { Loader2 } from 'lucide-react'
import {
  AssetType,
  AvatarAsset,
  AvatarRelatedAsset,
  WorldAsset,
} from '@/lib/entity'
import { AssetContext } from '@/components/context/AssetContext'

type Props = {
  setTab: (tab: string) => void
  setDialogOpen: (open: boolean) => void
}

const ManualInputTab = ({ setTab, setDialogOpen }: Props) => {
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const { form, assetPath, assetType } = useContext(AddAssetModalContext)
  const { addAvatarAsset, addAvatarRelatedAsset, addWorldAsset } =
    useContext(AssetContext)

  if (!form) {
    return <div>Loading...</div>
  }

  const backToAssetTypeSelectorTab = () => {
    setTab('asset-type-selector')
  }

  const submit = async () => {
    if (submitting) {
      return
    }

    setSubmitting(true)

    try {
      const preAsset = createPreAsset({
        assetType: assetType!,
        description: {
          title: form.getValues('title'),
          author: form.getValues('author'),
          image_src: form.getValues('image_src'),
          tags: form.getValues('tags'),
          created_at: new Date().toISOString(),
        },
        category: form.getValues('category'),
        supportedAvatars: [],
      })

      if (preAsset.isFailure()) {
        toast({
          title: 'データのインポートに失敗しました',
          description: preAsset.error.message,
        })

        return
      }

      const result = await sendAssetImportRequest(
        assetType!,
        assetPath!,
        preAsset.value,
      )

      if (result.isSuccess()) {
        console.log(result.value)
        if (assetType === AssetType.Avatar) {
          addAvatarAsset(result.value as AvatarAsset)
        } else if (assetType === AssetType.AvatarRelated) {
          addAvatarRelatedAsset(result.value as AvatarRelatedAsset)
        } else if (assetType === AssetType.World) {
          addWorldAsset(result.value as WorldAsset)
        }

        toast({
          title: 'データのインポートが完了しました！',
        })

        setDialogOpen(false)
        return
      }

      toast({
        title: 'データのインポートに失敗しました',
        description: result.error.message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const image_src = form.getValues('image_src')

  return (
    <TabsContent value="manual-input">
      <DialogHeader>
        <DialogTitle>(4/4) アセット情報の入力</DialogTitle>
        <DialogDescription>
          アセットの情報を入力してください！
        </DialogDescription>
      </DialogHeader>
      <div className="my-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <div className="flex flex-row space-x-6">
              <div className="w-1/3 rounded-lg">
                <AspectRatio ratio={1}>
                  {image_src && (
                    <img
                      src={form.getValues('image_src')}
                      alt="asset_image"
                      className="rounded-lg"
                    />
                  )}
                  {!image_src && (
                    <div className="w-full h-full bg-slate-400 rounded-lg"></div>
                  )}
                </AspectRatio>
              </div>
              <div className="w-2/3 space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>アセット名</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="アセットの名前を入力..."
                          disabled={submitting}
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
                          disabled={submitting}
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
              </div>
            </div>

            <div className="w-full flex flex-row space-x-2">
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
              <Separator orientation="vertical" className="h-32 my-auto" />
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
                            console.log(value)
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
                              <SelectItem value="accessory">
                                アクセサリ
                              </SelectItem>
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
            </div>
            <div className="w-full flex justify-between">
              <Button
                variant="outline"
                onClick={backToAssetTypeSelectorTab}
                disabled={submitting}
              >
                戻る
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="animate-spin" />}
                アセットを追加
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </TabsContent>
  )
}

export default ManualInputTab
