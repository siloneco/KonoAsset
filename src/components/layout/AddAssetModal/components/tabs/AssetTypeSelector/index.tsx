import { useContext } from 'react'
import { AddAssetModalContext } from '../../..'
import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { TabsContent } from '@/components/ui/tabs'
import SelectTypeButton from './selector/SelectTypeButton'
import { AssetType } from '@/lib/entity'

type Props = {
  setTab: (tab: string) => void
}

const AssetTypeSelectorTab = ({ setTab }: Props) => {
  const { assetType, setAssetType } = useContext(AddAssetModalContext)

  const backToBoothInput = () => {
    setTab('booth-input')
  }

  const moveToManualInputTab = () => {
    setTab('manual-input')
  }

  return (
    <TabsContent value="asset-type-selector">
      <DialogHeader>
        <DialogTitle>(3/4) アセットのタイプを選択</DialogTitle>
        <DialogDescription>
          アセットのタイプを選択してください！
        </DialogDescription>
      </DialogHeader>
      <div className="my-8 space-y-6 flex flex-col items-center">
        <SelectTypeButton
          text="アバター素体"
          onClick={() => {
            setAssetType(AssetType.Avatar)
          }}
          selected={assetType === AssetType.Avatar}
        />
        <SelectTypeButton
          text="アバター関連 (服 / 髪 / アクセサリ / ギミック等)"
          onClick={() => {
            setAssetType(AssetType.AvatarRelated)
          }}
          selected={assetType === AssetType.AvatarRelated}
        />
        <SelectTypeButton
          text="ワールドアセット"
          onClick={() => {
            setAssetType(AssetType.World)
          }}
          selected={assetType === AssetType.World}
        />
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          className="mr-auto"
          onClick={backToBoothInput}
        >
          戻る
        </Button>
        <Button className="mr-auto" onClick={moveToManualInputTab}>
          次へ
        </Button>
      </DialogFooter>
    </TabsContent>
  )
}

export default AssetTypeSelectorTab
