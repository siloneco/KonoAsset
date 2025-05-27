import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { useLocalization } from '@/hooks/use-localization'
import { FC } from 'react'
import { useAvatarLayout } from './hook'
import { AssetType } from '@/lib/bindings'

type Props = {
  assetTags: {
    value: string[]
    setValue: (value: string[]) => void
    getCandidates: (type: AssetType) => Promise<Option[]>
  }
}

export const AvatarLayout: FC<Props> = ({ assetTags }) => {
  const { t } = useLocalization()
  const { tagOptionValues, tagCandidates } = useAvatarLayout({
    tags: assetTags.value,
    fetchTagCandidates: assetTags.getCandidates,
  })

  return (
    <div className="w-full mb-4 grid grid-cols-1 space-y-2">
      <Label> {t('general:tag')} </Label>
      <MultipleSelector
        options={tagCandidates}
        placeholder={t('addasset:tag:placeholder')}
        badgeClassName="max-w-[600px]"
        hidePlaceholderWhenSelected
        creatable
        emptyIndicator={
          <p className="text-center text-lg text-muted-foreground">
            {t('addasset:empty-indicator')}
          </p>
        }
        value={tagOptionValues}
        onChange={(value) => {
          assetTags.setValue(value.map((v) => v.value))
        }}
      />
      <p className="text-muted-foreground text-sm">
        {t('addasset:tag:explanation-text')}
      </p>
    </div>
  )
}
