import { Label } from '@/components/ui/label'
import { FC } from 'react'
import { ThumbnailOptimizeDialog } from '../ThumbnailOptimizeDialog'
import { useLocalization } from '@/hooks/use-localization'

export const ThumbnailOptimizer: FC = () => {
  const { t } = useLocalization()

  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2 w-full">
        <Label className="text-lg">
          {t('preference:thumbnail-optimizer:optimize')}
        </Label>
        <p className="text-muted-foreground text-sm w-10/12">
          {t('preference:thumbnail-optimizer:optimize:description')}
        </p>
      </div>
      <ThumbnailOptimizeDialog />
    </div>
  )
}
