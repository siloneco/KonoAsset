import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multi-select'

import TextInputSelect from '@/components/ui/text-input-select'
import { AssetType } from '@/lib/bindings'
import { FC } from 'react'
import { useLocalization } from '@/hooks/use-localization'
import { useAvatarWearableLayout } from './hook'

type Props = {
  assetCategory: {
    value: string | null
    setValue: (value: string | null) => void
    getCandidates: (type: Omit<AssetType, 'Avatar'>) => Promise<Option[]>
  }
  assetSupportedAvatars: {
    value: string[]
    setValue: (value: string[]) => void
    getCandidates: () => Promise<Option[]>
  }
  assetTags: {
    value: string[]
    setValue: (value: string[]) => void
    getCandidates: (type: AssetType) => Promise<Option[]>
  }
}

export const AvatarWearableLayout: FC<Props> = ({
  assetSupportedAvatars,
  assetCategory,
  assetTags,
}) => {
  const { t } = useLocalization()

  const {
    categoryOptionValue,
    categoryCandidates,
    supportedAvatarOptionValues,
    supportedAvatarCandidates,
    tagOptionValues,
    tagCandidates,
  } = useAvatarWearableLayout({
    category: assetCategory.value,
    supportedAvatars: assetSupportedAvatars.value,
    tags: assetTags.value,
    fetchCategoryCandidates: assetCategory.getCandidates,
    fetchSupportedAvatarCandidates: assetSupportedAvatars.getCandidates,
    fetchTagCandidates: assetTags.getCandidates,
  })

  return (
    <div className="mb-4">
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="w-full space-y-2">
          <Label> {t('general:supported-avatars')} </Label>
          <MultipleSelector
            options={supportedAvatarCandidates}
            placeholder={t('addasset:supported-avatars:placeholder')}
            className="w-full"
            badgeClassName="max-w-66"
            hidePlaceholderWhenSelected
            creatable
            emptyIndicator={
              <p className="text-center text-lg text-muted-foreground">
                {t('addasset:empty-indicator')}
              </p>
            }
            value={supportedAvatarOptionValues}
            onChange={(value) =>
              assetSupportedAvatars.setValue(value.map((v) => v.value))
            }
          />
          <p className="text-muted-foreground text-sm">
            {t('addasset:supported-avatars:explanation-text')}
          </p>
        </div>
        <div className="space-y-2">
          <Label> {t('general:category')} </Label>
          <TextInputSelect
            options={categoryCandidates}
            placeholder={t('addasset:category:placeholder')}
            className="w-full"
            creatable
            emptyIndicator={
              <p className="text-center text-lg text-muted-foreground">
                {t('addasset:empty-indicator')}
              </p>
            }
            value={categoryOptionValue}
            onChange={(value) => {
              assetCategory.setValue(value?.value ?? null)
            }}
          />
          <p className="text-muted-foreground text-sm">
            {t('addasset:category:explanation-text')}
          </p>
        </div>
        <div className="space-y-2">
          <Label> {t('general:tag')} </Label>
          <MultipleSelector
            options={tagCandidates}
            placeholder={t('addasset:tag:placeholder')}
            className="w-full"
            badgeClassName="max-w-66"
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
      </div>
    </div>
  )
}
