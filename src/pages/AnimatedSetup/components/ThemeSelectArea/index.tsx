import { useLocalization } from '@/hooks/use-localization'
import { FC, useCallback, useContext } from 'react'
import { useTheme } from 'next-themes'
import { PreferenceContext } from '@/components/context/PreferenceContext'
import { Label } from '@/components/ui/label'
import { ThemePreview } from '../ThemePreview'
import { cn } from '@/lib/utils'

export const ThemeSelectArea: FC = () => {
  const { t } = useLocalization()
  const { resolvedTheme } = useTheme()
  const { preference, setPreference } = useContext(PreferenceContext)

  const onThemeChangeClicked = useCallback(
    (theme: 'light' | 'dark') => {
      setPreference(
        {
          ...preference,
          theme,
        },
        false,
      )
    },
    [preference, setPreference],
  )

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col items-center gap-2">
        <Label className="text-xl flex flex-row items-center">
          {t('preference:settings:theme')}
        </Label>
        <p className="text-muted-foreground text-sm">
          {t('preference:settings:theme:explanation-text')}
        </p>
      </div>
      <div className="grid gap-4">
        <ThemePreview
          theme="light"
          onClick={() => onThemeChangeClicked('light')}
          className={cn(
            resolvedTheme === 'light' &&
              'border-primary ring-2 ring-primary/40',
          )}
        />
        <ThemePreview
          theme="dark"
          onClick={() => onThemeChangeClicked('dark')}
          className={cn(
            resolvedTheme === 'dark' && 'border-primary ring-2 ring-primary/40',
          )}
        />
      </div>
    </div>
  )
}
