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
import { useContext } from 'react'
import { AddAssetModalContext } from '../../..'
import { useToast } from '@/hooks/use-toast'
import {
  AssetImportRequest,
  AssetImportResult,
  PreAvatarAsset,
} from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'

type Props = {
  setTab: (tab: string) => void
}

const ManualInputTab = ({ setTab }: Props) => {
  const { toast } = useToast()
  const { form, assetPath } = useContext(AddAssetModalContext)

  if (!form) {
    return <div>Loading...</div>
  }

  const backToBoothInputTab = () => {
    setTab('booth-input')
  }

  const submit = async () => {
    const preAsset: PreAvatarAsset = {
      description: {
        title: form.getValues('title'),
        author: form.getValues('author'),
        image_src: form.getValues('image_src'),
        tags: [],
        created_at: new Date().toISOString(),
      },
    }

    const request: AssetImportRequest = {
      pre_asset: preAsset,
      file_or_dir_absolute_path: assetPath!,
    }

    const result: AssetImportResult = await invoke(
      'request_avatar_asset_import',
      {
        request,
      },
    )

    if (result.success) {
      toast({
        title: 'データのインポートが完了しました！',
        description: result.asset?.description.title,
      })

      return
    }

    toast({
      title: 'データのインポートに失敗しました',
      description: result.error_message,
    })
  }

  return (
    <TabsContent value="manual-input">
      <DialogHeader>
        <DialogTitle>③ アセット情報の入力</DialogTitle>
        <DialogDescription>
          アセットの情報を入力してください！
        </DialogDescription>
      </DialogHeader>
      <div className="my-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <div className="flex flex-row space-x-6">
              <div className="w-1/3">
                <img
                  src={form.getValues('image_src')}
                  alt="asset_image"
                  className="rounded-lg"
                />
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

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>なんかこの辺でタグとか入力したい (適当)</FormLabel>
                  <FormControl>
                    <Input placeholder="タグ入力する場所" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-between">
              <Button variant="outline" onClick={backToBoothInputTab}>
                戻る
              </Button>
              <Button type="submit">アセットを追加</Button>
            </div>
          </form>
        </Form>
      </div>
    </TabsContent>
  )
}

export default ManualInputTab
