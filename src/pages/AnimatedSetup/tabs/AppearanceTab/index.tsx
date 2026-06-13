import { FC } from 'react'
import { ThemeSelectArea } from '../../components/ThemeSelectArea'
import { Separator } from '@/components/ui/separator'
import { LanguageSelectArea } from '../../components/LanguageSelectArea'
import { Button } from '@/components/ui/button'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  nextTab: () => void
}

export const AppearanceTab: FC<Props> = ({ nextTab }) => {
  const { t } = useLocalization()

  return (
    <div className="size-full flex justify-center">
      <ThemeSelectArea />
      <Separator orientation="vertical" className="shrink-0 mx-8" />
      <div className="w-full flex flex-col justify-between">
        <LanguageSelectArea />
        <div className="w-full flex justify-end" onClick={nextTab}>
          <Button>{t('general:button:next')}</Button>
        </div>
      </div>
    </div>
  )
}
