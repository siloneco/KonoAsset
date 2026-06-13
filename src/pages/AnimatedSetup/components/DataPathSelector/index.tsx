import { useLocalization } from '@/hooks/use-localization'
import { FC } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useDataPathSelector } from './hook'

export const DataPathSelector: FC = () => {
  const { t } = useLocalization()

  const { currentPath, openDirectory, selectPath } = useDataPathSelector()

  return (
    <div className="space-y-2">
      <Label>{t('setup:tab:2:input-label')}</Label>
      <div className="flex gap-2">
        <Input value={currentPath} disabled />
        <Button variant="secondary" className="h-10" onClick={openDirectory}>
          {t('general:button:open')}
        </Button>
        <Button className="h-10" onClick={selectPath}>
          {t('general:button:select')}
        </Button>
      </div>
    </div>
  )
}
