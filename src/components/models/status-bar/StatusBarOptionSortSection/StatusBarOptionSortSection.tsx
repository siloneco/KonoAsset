import { FC } from 'react'
import { useLocalization } from '@/hooks/use-localization'
import { Label } from '@/components/ui/label'
import { ArrowDownAz } from 'lucide-react'
import { StatusBarOptionSelectButton } from '../StatusBarOptionSelectButton'

type Props = {
  value: string
  setValue: (value: string) => void
}

export const StatusBarOptionSortSection: FC<Props> = ({ value, setValue }) => {
  const { t } = useLocalization()

  return (
    <div>
      <Label className="px-4 py-2 text-base">
        <ArrowDownAz className="text-muted-foreground size-5" />
        {t('mainnavbar:sort-settings:title')}
      </Label>
      <StatusBarOptionSelectButton
        value="CreatedAtDesc"
        setter={setValue}
        current={value}
      >
        {t('mainnavbar:sort-settings:created-at-desc')}
      </StatusBarOptionSelectButton>
      <StatusBarOptionSelectButton
        value="CreatedAtAsc"
        setter={setValue}
        current={value}
      >
        {t('mainnavbar:sort-settings:created-at-asc')}
      </StatusBarOptionSelectButton>
      <StatusBarOptionSelectButton
        value="NameAsc"
        setter={setValue}
        current={value}
      >
        {t('mainnavbar:sort-settings:asset-name-asc')}
      </StatusBarOptionSelectButton>
      <StatusBarOptionSelectButton
        value="NameDesc"
        setter={setValue}
        current={value}
      >
        {t('mainnavbar:sort-settings:asset-name-desc')}
      </StatusBarOptionSelectButton>
      <StatusBarOptionSelectButton
        value="CreatorAsc"
        setter={setValue}
        current={value}
      >
        {t('mainnavbar:sort-settings:shop-name-asc')}
      </StatusBarOptionSelectButton>
      <StatusBarOptionSelectButton
        value="CreatorDesc"
        setter={setValue}
        current={value}
      >
        {t('mainnavbar:sort-settings:shop-name-desc')}
      </StatusBarOptionSelectButton>
      <StatusBarOptionSelectButton
        value="PublishedAtDesc"
        setter={setValue}
        current={value}
      >
        {t('mainnavbar:sort-settings:published-at-desc')}
      </StatusBarOptionSelectButton>
      <StatusBarOptionSelectButton
        value="PublishedAtAsc"
        setter={setValue}
        current={value}
      >
        {t('mainnavbar:sort-settings:published-at-asc')}
      </StatusBarOptionSelectButton>
    </div>
  )
}
