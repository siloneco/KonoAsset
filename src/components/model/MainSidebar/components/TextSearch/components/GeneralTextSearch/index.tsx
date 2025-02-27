import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { FC, RefObject } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  onSwitchModeClicked: () => void

  general: string
  setGeneral: (general: string) => void

  ref: RefObject<HTMLInputElement | null>
}

const GeneralTextSearch: FC<Props> = ({
  onSwitchModeClicked,
  general,
  setGeneral,
  ref,
}) => {
  const { t } = useLocalization()

  return (
    <div className="mb-4">
      <div className="flex flex-row">
        <Label className="text-base">{t('mainsidebar:text-search')}</Label>
        <div
          className="w-16 bg-background text-foreground border-2 border-border px-4 ml-auto rounded-full text-[12px] flex items-center justify-center cursor-pointer select-none"
          onClick={onSwitchModeClicked}
        >
          {t('mainsidebar:advanced-search')}
        </div>
      </div>
      <div className="relative w-full max-w-sm mt-2">
        <Input
          placeholder={t('mainsidebar:general-search:placeholder')}
          className="mt-1"
          value={general}
          onChange={(e) => setGeneral(e.target.value)}
          ref={ref}
        />
        {general && (
          <X
            size={24}
            className="absolute right-1 top-1/2 -translate-y-1/2 mr-2 cursor-pointer"
            onClick={() => {
              setGeneral('')
            }}
          />
        )}
      </div>
    </div>
  )
}

export default GeneralTextSearch
