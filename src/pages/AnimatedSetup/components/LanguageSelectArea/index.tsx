import { useLocalization } from '@/hooks/use-localization'
import { FC, useCallback, useContext } from 'react'
import { PreferenceContext } from '@/components/context/PreferenceContext'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CN, FlagComponent, GB, JP, US } from 'country-flag-icons/react/3x2'
import { LanguageCode } from '@/lib/bindings'

export const LanguageSelectArea: FC = () => {
  const { t } = useLocalization()
  const { preference, setPreference } = useContext(PreferenceContext)

  const onLanguageChangeClicked = useCallback(
    (language: LanguageCode) => {
      setPreference({ ...preference, language }, false)
    },
    [preference, setPreference],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <Label className="text-xl">{t('preference:settings:language')}</Label>
        <p className="text-muted-foreground text-sm">
          {t('preference:settings:language:explanation-text')}
        </p>
      </div>
      <div className="grid gap-2">
        <LanguageSelector
          language="English (US)"
          active={preference.language === 'en-US'}
          Flag={US}
          onClick={() => onLanguageChangeClicked('en-US')}
        />
        <LanguageSelector
          language="English (UK)"
          active={preference.language === 'en-GB'}
          Flag={GB}
          onClick={() => onLanguageChangeClicked('en-GB')}
        />
        <LanguageSelector
          language="日本語"
          active={preference.language === 'ja-JP'}
          Flag={JP}
          onClick={() => onLanguageChangeClicked('ja-JP')}
        />
        <LanguageSelector
          language="简体中文"
          active={preference.language === 'zh-CN'}
          Flag={CN}
          onClick={() => onLanguageChangeClicked('zh-CN')}
        />
      </div>
    </div>
  )
}

type LanguageSelectorProps = {
  language: string
  active: boolean
  Flag: FlagComponent
  onClick?: () => void
}

const LanguageSelector: FC<LanguageSelectorProps> = ({
  language,
  active,
  Flag,
  onClick,
}) => {
  return (
    <div
      className={cn(
        'px-3 py-2 rounded-lg flex items-center gap-2 border-2 transition-all duration-200',
        active && 'border-primary ring-2 ring-primary/40',
        onClick && 'cursor-pointer',
      )}
      onClick={onClick}
    >
      <Flag className="size-5" />
      {language}
    </div>
  )
}
