import { LanguageCode } from '@/lib/bindings'
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
import { Languages } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

type Props = {
  language: LanguageCode
  setLanguage: (
    language: Exclude<LanguageCode, { 'user-provided': string }>,
  ) => void
  loadLanguageFile?: () => Promise<void>
}

export const LanguageSelector: FC<Props> = ({
  language,
  setLanguage,
  loadLanguageFile,
}) => {
  const { t } = useLocalization()

  const selectValueLanguage =
    typeof language === 'string' ? language : 'user-provided'
  const customLanguage =
    typeof language === 'string' ? language : language['user-provided']

  const onSelectValueChange = (value: string) => {
    if (value === 'user-provided' && loadLanguageFile !== undefined) {
      loadLanguageFile()
    } else {
      setLanguage(value as Exclude<LanguageCode, { 'user-provided': string }>)
    }
  }

  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2">
        <Label className="text-xl flex flex-row items-center">
          {t('preference:settings:language')}
          <Languages className="opacity-70 ml-2" />
        </Label>
        <p className="text-muted-foreground text-sm">
          {t('preference:settings:language:explanation-text')}
        </p>
      </div>
      <div className="flex flex-row ml-auto space-x-2">
        <Select value={selectValueLanguage} onValueChange={onSelectValueChange}>
          <SelectTrigger className="ml-auto w-[180px]">
            <SelectValue placeholder={t('general:select:placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English (US)</SelectItem>
            <SelectItem value="en-GB">English (UK)</SelectItem>
            <SelectItem value="ja-JP">日本語</SelectItem>
            <SelectItem value="zh-CN">简体中文</SelectItem>
            {loadLanguageFile !== undefined && (
              <>
                <Separator className="my-2" />
                <SelectItem value="user-provided">
                  {selectValueLanguage !== 'user-provided' &&
                    t('preference:language:load-from-file')}
                  {selectValueLanguage === 'user-provided' &&
                    `${t('preference:language:custom')} (${customLanguage})`}
                </SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
