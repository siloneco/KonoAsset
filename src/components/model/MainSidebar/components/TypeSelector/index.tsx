import { RadioGroup } from '@/components/ui/radio-group'
import { useContext } from 'react'
import { Separator } from '@/components/ui/separator'
import TypeSelectorRadioItem from './components/RadioItem'
import { PersistentContext } from '@/components/context/PersistentContext'
import { AssetType } from '@/lib/bindings'

const TypeSelector = () => {
  const { assetType, setAssetType } = useContext(PersistentContext)

  const onValueChange = (value: string) => {
    if (
      value === 'All' ||
      value === 'Avatar' ||
      value === 'AvatarWearable' ||
      value === 'WorldObject'
    ) {
      setAssetType(value)
    } else {
      setAssetType('All')
    }
  }

  return (
    <RadioGroup
      defaultValue="All"
      className="space-y-1 mt-3"
      onValueChange={onValueChange}
      value={assetType}
    >
      <TypeSelectorRadioItem id="r1" value="All" text="すべて表示" />
      <Separator />
      <TypeSelectorRadioItem
        id="r2"
        value={'Avatar' as AssetType}
        text="アバター素体"
      />
      <TypeSelectorRadioItem
        id="r3"
        value={'AvatarWearable' as AssetType}
        text="アバター関連アセット"
      />
      <TypeSelectorRadioItem
        id="r4"
        value={'WorldObject' as AssetType}
        text="ワールドアセット"
      />
    </RadioGroup>
  )
}

export default TypeSelector
