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

type Props = {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
}

export const LanguageSelector: FC<Props> = ({ language, setLanguage }) => {
  const { t } = useLocalization()

  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2">
        <Label className="text-xl flex flex-row items-center">
          {t('preference:settings:language')}
          <Languages className="opacity-70 ml-2" />
        </Label>
        <p className="text-foreground/60 text-sm">
          {t('preference:settings:language:explanation-text')}
        </p>
      </div>
      <div className="flex flex-row ml-auto space-x-2">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="ml-auto w-[180px]">
            <SelectValue placeholder={t('general:select:placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jaJp">日本語</SelectItem>
            <SelectItem value="enUs">English (US)</SelectItem>
            <SelectItem value="enGb">English (UK)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
