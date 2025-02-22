import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useManualInputTabHooks } from './hook'
import SquareImage from '@/components/model/SquareImage'
import { AssetFormType } from '@/lib/form'
import { Label } from '@/components/ui/label'
import AvatarLayout from './layout/AvatarLayout'
import AvatarWearableLayout from './layout/AvatarWearableLayout'
import WorldObjectLayout from './layout/WorldObjectLayout'

type Props = {
  form: AssetFormType
  imageUrls: string[]
  onBackToPreviousTabClicked: () => void
  onGoToNextTabClicked: () => void

  tabIndex: number
  totalTabs: number
}

const ManualInputTab = ({
  form,
  imageUrls,
  onBackToPreviousTabClicked,
  onGoToNextTabClicked,

  tabIndex,
  totalTabs,
}: Props) => {
  const {
    assetType,
    imageFilename,
    setImageFilename,
    imageUrlIndex,
    setImageUrlIndex,
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
            <div className="space-y-2">
              <Label>アセット名</Label>
              <Input
                placeholder="アセットの名前を入力..."
                autoComplete="off"
                value={form.watch('name')}
                onChange={(e) => form.setValue('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>ショップ名</Label>
              <Input
                placeholder="ショップの名前を入力..."
                autoComplete="off"
                value={form.watch('creator')}
                onChange={(e) => form.setValue('creator', e.target.value)}
              />
            </div>
          </div>
        </div>

        {assetType === 'Avatar' && <AvatarLayout form={form} />}
        {assetType === 'AvatarWearable' && <AvatarWearableLayout form={form} />}
        {assetType === 'WorldObject' && <WorldObjectLayout form={form} />}

        <div className="w-full flex justify-between">
          <Button variant="outline" onClick={onBackToPreviousTabClicked}>
            戻る
          </Button>
          <Button onClick={onGoToNextTabClicked}>次へ</Button>
        </div>
      </div>
    </>
  )
}

export default ManualInputTab
