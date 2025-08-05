import { FC } from 'react'
import { StatusBarOptionSelectButton } from '../StatusBarOptionSelectButton'
import { Label } from '@/components/ui/label'
import { Proportions } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  value: string
  setValue: (value: string) => void
}

export const StatusBarOptionLayoutSection: FC<Props> = ({
  value,
  setValue,
}) => {
  const { t } = useLocalization()

  return (
    <div>
      <Label className="px-4 py-2 text-base">
        <Proportions className="text-muted-foreground size-5" />
        {t('mainnavbar:size-settings:title')}
      </Label>
      <StatusBarOptionSelectButton
        value="GridLarge"
        setter={setValue}
        current={value}
      >
        {t('mainnavbar:size-settings:large')}
      </StatusBarOptionSelectButton>
      <StatusBarOptionSelectButton
        value="GridMedium"
        setter={setValue}
        current={value}
      >
        {t('mainnavbar:size-settings:medium')}
      </StatusBarOptionSelectButton>
      <StatusBarOptionSelectButton
        value="GridSmall"
        setter={setValue}
        current={value}
      >
        {t('mainnavbar:size-settings:small')}
      </StatusBarOptionSelectButton>
      <StatusBarOptionSelectButton
        value="List"
        setter={setValue}
        current={value}
      >
        {t('mainnavbar:size-settings:list')}
      </StatusBarOptionSelectButton>
    </div>
  )
}
