import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

type Props = {
  form: AssetFormType
  imageUrls: string[]
  onBackToPreviousTabClicked: () => void
  onSubmit: () => Promise<void>
  submitting: boolean

  tabIndex: number
  totalTabs: number

  hideDeleteSourceCheckbox?: boolean
  submitButtonText?: string
}

const ManualInputTab = ({
  form,
  imageUrls,
  onBackToPreviousTabClicked,
  onSubmit,
  submitting,

  tabIndex,
  totalTabs,

  hideDeleteSourceCheckbox = false,
  submitButtonText = 'アセットを追加',
}: Props) => {
  const {
    assetType,
    imageFilename,
    setImageFilename,
    imageUrlIndex,
    setImageUrlIndex,
    deleteSourceChecked,
    setDeleteSourceChecked,
  } = useManualInputTabHooks({ form })

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex}/{totalTabs}) アセット情報の入力
        </DialogTitle>
        <DialogDescription>
          アセットの情報を入力してください！
        </DialogDescription>
      </DialogHeader>
      <div className="my-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.error(e))}
            className="space-y-4"
          >
            <div className="flex flex-row space-x-6">
              <div className="w-1/3">
                <SquareImage
                  assetType={assetType}
                  filename={imageFilename ?? undefined}
                  setFilename={setImageFilename}
                  selectable
                  imageUrls={imageUrls}
                  urlImageIndex={imageUrlIndex}
                  setUrlImageIndex={setImageUrlIndex}
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
                onClick={onBackToPreviousTabClicked}
                disabled={submitting}
              >
                戻る
              </Button>
              <div className="flex flex-row">
                {!hideDeleteSourceCheckbox && (
                  <div className="flex items-center mr-4">
                    <Checkbox
                      checked={deleteSourceChecked}
                      onCheckedChange={setDeleteSourceChecked}
                      disabled={submitting}
                    />
                    <Label
                      className="ml-2"
                      onClick={() =>
                        setDeleteSourceChecked(!deleteSourceChecked)
                      }
                    >
                      インポート後に元ファイルを削除する
                    </Label>
                  </div>
                )}
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="animate-spin" />}
                  {submitButtonText}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default ManualInputTab
