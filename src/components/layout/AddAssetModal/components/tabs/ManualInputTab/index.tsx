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
import SquareImage from '@/components/model/SquareImage'
import { AssetFormType } from '@/lib/form'

type Props = {
  form: AssetFormType
  setTab: (tab: string) => void
  setDialogOpen: (open: boolean) => void
}

const ManualInputTab = ({ form, setTab, setDialogOpen }: Props) => {
  const {
    backToAssetTypeSelectorTab,
    submit,
    submitting,
    assetType,
    imageSrc,
    setImageSrc,
  } = useManualInputTabHooks({ form, setTab, setDialogOpen })

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
                <SquareImage
                  assetType={assetType}
                  path={imageSrc ?? undefined}
                  setPath={setImageSrc}
                  selectable
                />
              </div>
              <div className="w-2/3 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>アセット名</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="アセットの名前を入力..."
                          autoComplete="off"
                          disabled={submitting}
                          {...field}
                        />
                      </FormControl>
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
                          autoComplete="off"
                          disabled={submitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {assetType === AssetType.Avatar && (
              <AvatarLayout form={form} submitting={submitting} />
            )}
            {assetType === AssetType.AvatarRelated && (
              <AvatarRelatedLayout form={form} submitting={submitting} />
            )}
            {assetType === AssetType.World && (
              <WorldLayout form={form} submitting={submitting} />
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
