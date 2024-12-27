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
import AvatarLayout from './layout/AvatarLayout'
import AvatarWearableLayout from './layout/AvatarWearableLayout'
import WorldObjectLayout from './layout/WorldObjectLayout'
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
    imagePath,
    setImagePath,
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
          <form
            onSubmit={form.handleSubmit(submit, (e) => console.error(e))}
            className="space-y-4"
          >
            <div className="flex flex-row space-x-6">
              <div className="w-1/3">
                <SquareImage
                  assetType={assetType}
                  path={imagePath ?? undefined}
                  setPath={setImagePath}
                  selectable
                />
              </div>
              <div className="w-2/3 space-y-6">
                <FormField
                  control={form.control}
                  name="name"
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
                  name="creator"
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

            {assetType === 'Avatar' && (
              <AvatarLayout form={form} submitting={submitting} />
            )}
            {assetType === 'AvatarWearable' && (
              <AvatarWearableLayout form={form} submitting={submitting} />
            )}
            {assetType === 'WorldObject' && (
              <WorldObjectLayout form={form} submitting={submitting} />
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
