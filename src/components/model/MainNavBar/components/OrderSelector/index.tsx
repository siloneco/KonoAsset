import { FC } from 'react'
import { ButtonWithCheckMark } from '../ButtonWithCheckMark'
import { useLocalization } from '@/hooks/use-localization'
import { Label } from '@/components/ui/label'
import { ArrowDownAz } from 'lucide-react'

type Props = {
  current: string
  setValue: (value: string) => void
}

export const OrderSelector: FC<Props> = ({ current, setValue }) => {
  const { t } = useLocalization()

  return (
    <div>
      <Label className="px-4 py-2 flex flex-row items-center text-base">
        <ArrowDownAz className="text-muted-foreground mr-2" size={20} />
        {t('mainnavbar:sort-settings:title')}
      </Label>
      <ButtonWithCheckMark
        value="CreatedAtDesc"
        setter={setValue}
        current={current}
      >
        {t('mainnavbar:sort-settings:created-at-desc')}
      </ButtonWithCheckMark>
      <ButtonWithCheckMark
        value="CreatedAtAsc"
        setter={setValue}
        current={current}
      >
        {t('mainnavbar:sort-settings:created-at-asc')}
      </ButtonWithCheckMark>
      <ButtonWithCheckMark value="NameAsc" setter={setValue} current={current}>
        {t('mainnavbar:sort-settings:asset-name-asc')}
      </ButtonWithCheckMark>
      <ButtonWithCheckMark value="NameDesc" setter={setValue} current={current}>
        {t('mainnavbar:sort-settings:asset-name-desc')}
      </ButtonWithCheckMark>
      <ButtonWithCheckMark
        value="CreatorAsc"
        setter={setValue}
        current={current}
      >
        {t('mainnavbar:sort-settings:shop-name-asc')}
      </ButtonWithCheckMark>
      <ButtonWithCheckMark
        value="CreatorDesc"
        setter={setValue}
        current={current}
      >
        {t('mainnavbar:sort-settings:shop-name-desc')}
      </ButtonWithCheckMark>
      <ButtonWithCheckMark
        value="PublishedAtDesc"
        setter={setValue}
        current={current}
      >
        {t('mainnavbar:sort-settings:published-at-desc')}
      </ButtonWithCheckMark>
      <ButtonWithCheckMark
        value="PublishedAtAsc"
        setter={setValue}
        current={current}
      >
        {t('mainnavbar:sort-settings:published-at-asc')}
      </ButtonWithCheckMark>
    </div>
  )
}
