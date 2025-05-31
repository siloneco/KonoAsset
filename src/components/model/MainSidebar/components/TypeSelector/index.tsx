import { RadioGroup } from '@/components/ui/radio-group'
import { useContext } from 'react'
import { Separator } from '@/components/ui/separator'
import { TypeSelectorRadioItem } from './components/RadioItem'
import { AssetType } from '@/lib/bindings'
import { useLocalization } from '@/hooks/use-localization'
import { AssetFilterContext } from '@/components/functional/AssetFilterContext'

export const TypeSelector = () => {
  const { assetType, updateFilter } = useContext(AssetFilterContext)

  const { t } = useLocalization()
  const onValueChange = (value: string) => {
    if (
      value === 'All' ||
      value === 'Avatar' ||
      value === 'AvatarWearable' ||
      value === 'WorldObject'
    ) {
      updateFilter({ assetType: value as AssetType })
    } else {
      updateFilter({ assetType: 'All' })
    }
  }

  return (
    <RadioGroup
      defaultValue="All"
      className="space-y-1 mt-3"
      onValueChange={onValueChange}
      value={assetType}
    >
      <TypeSelectorRadioItem id="r1" value="All" text={t('general:show-all')} />
      <Separator />
      <TypeSelectorRadioItem
        id="r2"
        value={'Avatar' as AssetType}
        text={t('general:typeavatar')}
      />
      <TypeSelectorRadioItem
        id="r3"
        value={'AvatarWearable' as AssetType}
        text={t('general:typeavatarwearable')}
      />
      <TypeSelectorRadioItem
        id="r4"
        value={'WorldObject' as AssetType}
        text={t('general:typeworldobject')}
      />
    </RadioGroup>
  )
}
