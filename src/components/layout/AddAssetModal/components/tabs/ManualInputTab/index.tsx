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

import { AspectRatio } from '@/components/ui/aspect-ratio'

import { ImagePlus, Loader2 } from 'lucide-react'
import { AssetType } from '@/lib/entity'
import AvatarLayout from './layout/AvatarLayout'
import AvatarRelatedLayout from './layout/AvatarRelatedLayout'
import WorldLayout from './layout/WorldLayout'
import { useManualInputTabHooks } from './hook'
import { convertFileSrc } from '@tauri-apps/api/core'

type Props = {
  setTab: (tab: string) => void
  setDialogOpen: (open: boolean) => void
}

const ManualInputTab = ({ setTab, setDialogOpen }: Props) => {
  const {
    form,
    backToAssetTypeSelectorTab,
    openImageSelector,
    submit,
    submitting,
    assetType,
    imageSrc,
  } = useManualInputTabHooks({ setTab, setDialogOpen })

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
                  {imageSrc && imageSrc.startsWith('https://') && (
                    <img
                      src={imageSrc}
                      alt="asset_image"
                      className="rounded-lg"
                    />
                  )}
                  {imageSrc && !imageSrc.startsWith('https://') && (
                    <img
                      src={convertFileSrc(imageSrc)}
                      alt="asset_image"
                      className="rounded-lg"
                    />
                  )}
                  {!imageSrc && (
                    <div className="w-full h-full bg-slate-400 rounded-lg"></div>
                  )}
                  <div
                    className="absolute top-0 left-0 h-full w-full rounded-lg flex justify-center items-center opacity-0 bg-black transition-all cursor-pointer hover:opacity-100 hover:bg-opacity-50"
                    onClick={openImageSelector}
                  >
                    <ImagePlus size={50} />
                  </div>
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

            {assetType === AssetType.Avatar && (
              <AvatarLayout submitting={submitting} />
            )}
            {assetType === AssetType.AvatarRelated && (
              <AvatarRelatedLayout submitting={submitting} />
            )}
            {assetType === AssetType.World && (
              <WorldLayout submitting={submitting} />
            )}

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
