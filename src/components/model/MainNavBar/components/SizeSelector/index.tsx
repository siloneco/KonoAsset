import { FC } from 'react'
import { ButtonWithCheckMark } from '../ButtonWithCheckMark'
import { Label } from '@/components/ui/label'
import { Proportions } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  current: string
  setValue: (value: string) => void
}

export const SizeSelector: FC<Props> = ({ current, setValue }) => {
  const { t } = useLocalization()

  return (
    <div>
      <Label className="px-4 py-2 flex flex-row items-center text-base">
        <Proportions className="text-muted-foreground mr-2" size={20} />
        {t('mainnavbar:size-settings:title')}
      </Label>
      <ButtonWithCheckMark value="Large" setter={setValue} current={current}>
        {t('mainnavbar:size-settings:large')}
      </ButtonWithCheckMark>
      <ButtonWithCheckMark value="Medium" setter={setValue} current={current}>
        {t('mainnavbar:size-settings:medium')}
      </ButtonWithCheckMark>
      <ButtonWithCheckMark value="Small" setter={setValue} current={current}>
        {t('mainnavbar:size-settings:small')}
      </ButtonWithCheckMark>
      <ButtonWithCheckMark value="List" setter={setValue} current={current}>
        {t('mainnavbar:size-settings:list')}
      </ButtonWithCheckMark>
    </div>
  )
}
