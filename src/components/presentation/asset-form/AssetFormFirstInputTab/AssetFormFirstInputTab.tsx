import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocalization } from '@/hooks/use-localization'
import { FC } from 'react'
import { AssetType } from '@/lib/bindings'
import { SquareImage } from '../../square-image/SquareImage'
import { Option } from '@/components/ui/multi-select'
import { AvatarLayout } from './layout/AvatarLayout'
import { AvatarWearableLayout } from './layout/AvatarWearableLayout'
import { WorldObjectLayout } from './layout/WorldObjectLayout'

type Props = {
  tabIndex: {
    current: number
    total: number
  }
  assetType: AssetType
  assetImage: {
    src?: string
    loading: boolean
    indexSelector?: {
      index: number
      maxIndex: number
      setIndex: (index: number) => void
    }
    userImageProvider?: {
      openImagePathSelector: () => Promise<string | null>
      onImagePathProvided: (path: string) => void
    }
  }
  assetName: {
    value: string
    setValue: (value: string) => void
  }
  assetCreator: {
    value: string
    setValue: (value: string) => void
  }
  assetTags: {
    value: string[]
    setValue: (value: string[]) => void
    getCandidates: (type: AssetType) => Promise<Option[]>
  }
  assetCategory?: {
    value: string | null
    setValue: (value: string | null) => void
    getCandidates: (type: Omit<AssetType, 'Avatar'>) => Promise<Option[]>
  }
  assetSupportedAvatars?: {
    value: string[]
    setValue: (value: string[]) => void
    getCandidates: () => Promise<Option[]>
  }

  nextTab: () => void
  previousTab: () => void
}

export const AssetFormFirstInputTab: FC<Props> = ({
  tabIndex,
  assetType,
  assetImage,
  assetName,
  assetCreator,
  assetTags,
  assetCategory,
  assetSupportedAvatars,
  nextTab,
  previousTab,
}) => {
  const { t } = useLocalization()

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex.current}/{tabIndex.total}) {t('addasset:manual-input')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:manual-input:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="mt-2">
        <div className="grid grid-cols-3 gap-6 mb-4">
          <div>
            <SquareImage
              assetType={assetType}
              src={assetImage.src}
              loading={assetImage.loading}
              indexSelector={assetImage.indexSelector}
              userImageProvider={assetImage.userImageProvider}
            />
          </div>
          <div className="col-span-2 space-y-6">
            <div className="space-y-2">
              <Label>{t('addasset:manual-input:asset-name')}</Label>
              <Input
                placeholder={t('addasset:manual-input:asset-name:placeholder')}
                autoComplete="off"
                value={assetName.value}
                onChange={(e) => assetName.setValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label> {t('addasset:manual-input:shop-name')} </Label>
              <Input
                placeholder={t('addasset:manual-input:shop-name:placeholder')}
                autoComplete="off"
                value={assetCreator.value}
                onChange={(e) => assetCreator.setValue(e.target.value)}
              />
            </div>
          </div>
        </div>

        {assetType === 'Avatar' && <AvatarLayout assetTags={assetTags} />}
        {assetType === 'AvatarWearable' && (
          <AvatarWearableLayout
            assetCategory={assetCategory!}
            assetSupportedAvatars={assetSupportedAvatars!}
            assetTags={assetTags}
          />
        )}
        {assetType === 'WorldObject' && (
          <WorldObjectLayout
            assetCategory={assetCategory!}
            assetTags={assetTags}
          />
        )}

        <div className="w-full flex justify-between">
          <Button variant="outline" onClick={previousTab}>
            {t('general:button:back')}
          </Button>
          <Button onClick={nextTab}>{t('general:button:next')}</Button>
        </div>
      </div>
    </>
  )
}
