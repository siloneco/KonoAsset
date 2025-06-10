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

  name: string
  setName: (name: string) => void
  creator: string
  setCreator: (creator: string) => void

  ref: RefObject<HTMLInputElement | null>
}

export const AdvancedTextSearch: FC<Props> = ({
  onSwitchModeClicked,
  name,
  setName,
  creator,
  setCreator,
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
          className="w-fit bg-primary text-primary-foreground px-4 ml-auto rounded-full text-[12px] flex items-center justify-center cursor-pointer select-none"
          onClick={onSwitchModeClicked}
        >
          {t('mainsidebar:advanced-search')}
        </div>
      </div>
      <div className="mt-2">
        <Label>{t('mainsidebar:advanced-search:asset-name')}</Label>
        <div className="relative w-full max-w-sm">
          <Input
            placeholder={t(
              'mainsidebar:advanced-search:asset-name:placeholder',
            )}
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            ref={ref}
          />
          {name && (
            <X
              size={24}
              className="absolute right-1 top-1/2 -translate-y-1/2 mr-2 cursor-pointer"
              onClick={() => {
                setName('')
              }}
            />
          )}
        </div>
      </div>
      <div className="mt-2">
        <Label>{t('mainsidebar:advanced-search:shop-name')}</Label>
        <div className="relative w-full max-w-sm">
          <Input
            placeholder={t('mainsidebar:advanced-search:shop-name:placeholder')}
            className="mt-1"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
          />
          {creator && (
            <X
              size={24}
              className="absolute right-1 top-1/2 -translate-y-1/2 mr-2 cursor-pointer"
              onClick={() => {
                setCreator('')
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
