import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useContext } from 'react'
import { AssetFilterContext } from '../../context/AssetFilterContext'
import { AssetType } from '@/lib/entity'
import { Separator } from '@/components/ui/separator'

const TypeSelector = () => {
  const { assetType, setAssetType } = useContext(AssetFilterContext)

  return (
    <RadioGroup
      defaultValue="all"
      className="space-y-2"
      onValueChange={(v) => setAssetType(v as AssetType)}
      value={assetType}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={''} id="r1" />
        <Label htmlFor="r1" className="text-base">
          全て表示
        </Label>
      </div>
      <Separator />
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={AssetType.Avatar} id="r2" />
        <Label htmlFor="r2" className="text-base">
          アバター素体
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={AssetType.AvatarRelated} id="r3" />
        <Label htmlFor="r3" className="text-base">
          アバター関連アセット
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={AssetType.World} id="r4" />
        <Label htmlFor="r4" className="text-base">
          ワールド関連アセット
        </Label>
      </div>
    </RadioGroup>
  )
}

export default TypeSelector
