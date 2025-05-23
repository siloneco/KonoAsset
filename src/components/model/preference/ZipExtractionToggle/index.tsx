import { Label } from '@/components/ui/label'

import { FC } from 'react'
import { Switch } from '@/components/ui/switch'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  enable: boolean
  setEnable: (enable: boolean) => void
}

export const ZipExtractionToggle: FC<Props> = ({ enable, setEnable }) => {
  const { t } = useLocalization()

  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2 w-full">
        <Label className="text-lg">
          {t('preference:settings:zip-extraction-toggle')}
        </Label>
        <p className="text-muted-foreground text-sm w-10/12">
          {t('preference:settings:zip-extraction-toggle:explanation-text')}
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
