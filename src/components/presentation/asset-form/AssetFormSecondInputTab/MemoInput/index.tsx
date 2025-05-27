import { Label } from '@/components/ui/label'
import { useLocalization } from '@/hooks/use-localization'
import { Textarea } from '@/components/ui/textarea'
import { FC } from 'react'

type Props = {
  memo: string
  setMemo: (memo: string) => void
}

export const MemoInput: FC<Props> = ({ memo, setMemo }) => {
  const { t } = useLocalization()

  return (
    <div className="w-full flex flex-row mb-4">
      <div className="w-full space-y-2">
        <Label>{t('general:memo')}</Label>
        <Textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          autoComplete="off"
          className="resize-none h-28"
          placeholder={t('addasset:memo:placeholder')}
        />
        <p className="text-muted-foreground text-sm">
          {t('addasset:memo:explanation-text')}
        </p>
      </div>
    </div>
  )
}
