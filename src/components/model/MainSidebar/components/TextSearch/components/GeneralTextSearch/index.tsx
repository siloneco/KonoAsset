import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CircleHelp, X } from 'lucide-react'
import { FC, RefObject } from 'react'
import { useLocalization } from '@/hooks/use-localization'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type Props = {
  onSwitchModeClicked: () => void

  general: string
  setGeneral: (general: string) => void

  ref: RefObject<HTMLInputElement | null>
}

export const GeneralTextSearch: FC<Props> = ({
  onSwitchModeClicked,
  general,
  setGeneral,
  ref,
}) => {
  const { t } = useLocalization()

  return (
    <div className="mb-4">
      <div className="flex flex-row">
        <div className="flex flex-row items-center">
          <Label className="text-base">{t('mainsidebar:text-search')}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className="size-4 ml-1 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('mainsidebar:help:word-exclude-feature-tips')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div
          className="w-fit bg-sidebar text-sidebar-foreground border-2 border-sidebar-border px-4 ml-auto rounded-full text-[12px] flex items-center justify-center cursor-pointer select-none"
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
