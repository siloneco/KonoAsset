import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useManualInputTabHooks } from './hook'
import { SquareImage } from '@/components/model-legacy/SquareImage'
import { AssetFormType } from '@/lib/form'
import { Label } from '@/components/ui/label'
import { AvatarLayout } from './layout/AvatarLayout'
import { AvatarWearableLayout } from './layout/AvatarWearableLayout'
import { WorldObjectLayout } from './layout/WorldObjectLayout'
import { useLocalization } from '@/hooks/use-localization'
import { OtherAssetLayout } from './layout/OtherAssetLayout'
import TextInputSelect from '@/components/ui/text-input-select'

type Props = {
  form: AssetFormType
  imageUrls: string[]
  onBackToPreviousTabClicked: () => void
  onGoToNextTabClicked: () => void

  tabIndex: number
  totalTabs: number
}

export const ManualInputTab = ({
  form,
  imageUrls,
  onBackToPreviousTabClicked,
  onGoToNextTabClicked,

  tabIndex,
  totalTabs,
}: Props) => {
  const { t } = useLocalization()
  const {
    assetType,
    imageFilename,
    setImageFilename,
    imageUrlIndex,
    setImageUrlIndex,
    creatorCandidates,
  } = useManualInputTabHooks({ form })

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex}/{totalTabs}) {t('addasset:manual-input')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:manual-input:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4">
        <div className="flex flex-row space-x-6 mb-4">
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
              <Label> {t('addasset:manual-input:asset-name')} </Label>
              <Input
                placeholder={t('addasset:manual-input:asset-name:placeholder')}
                autoComplete="off"
                value={form.watch('name')}
                onChange={(e) => form.setValue('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label> {t('addasset:manual-input:shop-name')} </Label>
              <TextInputSelect
                options={creatorCandidates}
                placeholder={t('addasset:manual-input:shop-name:placeholder')}
                emptyIndicator={
                  <p className="text-center text-lg text-muted-foreground">
                    {t('addasset:empty-indicator')}
                  </p>
                }
                value={form.watch('creator')}
                onChange={(value) => {
                  form.setValue('creator', value)
                }}
              />
            </div>
          </div>
        </div>

        {assetType === 'Avatar' && <AvatarLayout form={form} />}
        {assetType === 'AvatarWearable' && <AvatarWearableLayout form={form} />}
        {assetType === 'WorldObject' && <WorldObjectLayout form={form} />}
        {assetType === 'OtherAsset' && <OtherAssetLayout form={form} />}

        <div className="w-full flex justify-between">
          <Button variant="outline" onClick={onBackToPreviousTabClicked}>
            {t('general:button:back')}
          </Button>
          <Button onClick={onGoToNextTabClicked}>
            {' '}
            {t('general:button:next')}{' '}
          </Button>
        </div>
      </div>
    </>
  )
}
