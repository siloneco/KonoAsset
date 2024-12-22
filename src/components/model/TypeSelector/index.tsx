import { RadioGroup } from '@/components/ui/radio-group'
import { useContext } from 'react'
import { AssetType } from '@/lib/entity'
import { Separator } from '@/components/ui/separator'
import TypeSelectorRadioItem from './components/RadioItem'
import { PersistentContext } from '@/components/context/PersistentContext'

const TypeSelector = () => {
  const { assetType, setAssetType } = useContext(PersistentContext)

  return (
    <RadioGroup
      defaultValue="all"
      className="space-y-1 mt-3"
      onValueChange={(v) => setAssetType(v as AssetType)}
      value={assetType}
    >
      <TypeSelectorRadioItem id="r1" value="all" text="すべて表示" />
      <Separator />
      <TypeSelectorRadioItem
        id="r2"
        value={AssetType.Avatar as string}
        text="アバター素体"
      />
      <TypeSelectorRadioItem
        id="r3"
        value={AssetType.AvatarRelated as string}
        text="アバター関連アセット"
      />
      <TypeSelectorRadioItem
        id="r4"
        value={AssetType.World as string}
        text="ワールドアセット"
      />
    </RadioGroup>
  )
}

export default TypeSelector
