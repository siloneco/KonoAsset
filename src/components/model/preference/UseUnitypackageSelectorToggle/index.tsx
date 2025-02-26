import { Label } from '@/components/ui/label'

import { FC } from 'react'
import { Switch } from '@/components/ui/switch'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  enable: boolean
  setEnable: (enable: boolean) => void
}

const UseUnitypackageSelectorToggle: FC<Props> = ({ enable, setEnable }) => {
  const { t } = useLocalization()
  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2">
        <Label className="text-lg">
          {t('preference:settings:use-unitypackage-selector')}
        </Label>
        <p className="text-foreground/60 text-sm w-10/12">
          {t('preference:settings:use-unitypackage-selector:explanation-text')}
        </p>
      </div>
      <Switch
        className="ml-auto"
        checked={enable}
        onCheckedChange={setEnable}
      />
    </div>
  )
}

export default UseUnitypackageSelectorToggle
