import { Label } from '@/components/ui/label'

import { FC } from 'react'
import { Switch } from '@/components/ui/switch'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  enable: boolean
  setEnable: (enable: boolean) => void
}

export const UseUnitypackageSelectorToggle: FC<Props> = ({
  enable,
  setEnable,
}) => {
  const { t } = useLocalization()
  return (
    <div className="flex flex-row items-center w-full gap-8">
      <div className="space-y-2 shrink min-w-0 overflow-hidden">
        <Label className="text-lg">
          {t('preference:settings:use-unitypackage-selector')}
        </Label>
        <p className="text-muted-foreground text-sm wrap-break-word">
          {t('preference:settings:use-unitypackage-selector:explanation-text')}
        </p>
      </div>
      <Switch
        className="ml-auto shrink-0"
        checked={enable}
        onCheckedChange={setEnable}
      />
    </div>
  )
}
