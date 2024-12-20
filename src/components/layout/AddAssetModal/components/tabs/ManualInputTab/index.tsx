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

import { Loader2 } from 'lucide-react'
import { AssetType } from '@/lib/entity'
import AvatarLayout from './layout/AvatarLayout'
import AvatarRelatedLayout from './layout/AvatarRelatedLayout'
import WorldLayout from './layout/WorldLayout'
import { useManualInputTabHooks } from './hook'
import ImagePicker from '@/components/model/ImagePicker'

type Props = {
  setTab: (tab: string) => void
  setDialogOpen: (open: boolean) => void
}

const ManualInputTab = ({ setTab, setDialogOpen }: Props) => {
  const {
    form,
    backToAssetTypeSelectorTab,
    submit,
    submitting,
    assetType,
    imageSrc,
    setImageSrc,
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
              <div className="w-1/3">
                <ImagePicker path={imageSrc} setPath={setImageSrc} />
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
