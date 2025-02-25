import { Theme } from '@/lib/bindings'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { FC } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeSelector: FC<Props> = ({ theme, setTheme }) => {
  const { t } = useLocalization()
  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2">
        <Label className="text-xl">{t('preference:settings:theme')}</Label>
        <p className="text-foreground/60 text-sm">
          {t('preference:settings:theme:explanation-text')}
        </p>
      </div>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="ml-auto w-[180px]">
          <SelectValue placeholder="選択..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="system">
            {t('preference:settings:theme:system')}
          </SelectItem>
          <SelectItem value="light">
            {t('preference:settings:theme:light')}
          </SelectItem>
          <SelectItem value="dark">
            {t('preference:settings:theme:dark')}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default ThemeSelector
