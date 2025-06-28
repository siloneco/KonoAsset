import { ResetDialog } from '@/components/model-legacy/ResetDialog'
import { Label } from '@/components/ui/label'
import { useLocalization } from '@/hooks/use-localization'

export const ResetButton = () => {
  const { t } = useLocalization()
  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2 w-full">
        <Label className="text-lg">{t('preference:settings:reset')}</Label>
        <p className="text-muted-foreground text-sm w-10/12">
          {t('preference:settings:reset:explanation-text')}
          <span className="font-bold">
            {t('preference:settings:reset:warning-text')}
          </span>
        </p>
      </div>
      <ResetDialog />
    </div>
  )
}
