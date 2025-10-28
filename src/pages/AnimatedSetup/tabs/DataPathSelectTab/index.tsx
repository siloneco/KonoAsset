import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import { useLocalization } from '@/hooks/use-localization'
import { FC } from 'react'
import { DataPathSelector } from '../../components/DataPathSelector'
import { Label } from '@/components/ui/label'
import { Folder } from 'lucide-react'

type Props = {
  previousTab: () => void
  nextTab: () => void
}

export const DataPathSelectPath: FC<Props> = ({ previousTab, nextTab }) => {
  const { t } = useLocalization()

  return (
    <div className="size-full flex flex-col justify-between gap-2">
      <div className="w-full space-y-12">
        <div className="flex flex-col items-center gap-2">
          <Label className="text-xl">
            <Folder className="size-6 text-muted-foreground" />
            {t('setup:tab:2:title')}
          </Label>
          <div className="flex flex-col items-center">
            <p className="text-muted-foreground">
              {t('setup:tab:2:description-1')}
            </p>
            <p className="text-muted-foreground">
              {t('setup:tab:2:description-2')}
            </p>
          </div>
        </div>
        <DataPathSelector />
      </div>
      <div className="w-full">
        <CardFooter className="w-full flex justify-between px-0">
          <Button variant="outline" onClick={previousTab}>
            {t('general:button:back')}
          </Button>
          <Button onClick={nextTab}>{t('general:button:next')}</Button>
        </CardFooter>
      </div>
    </div>
  )
}
