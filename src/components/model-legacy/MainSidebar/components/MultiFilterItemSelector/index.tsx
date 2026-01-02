import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { useMultiFilterItemSelector } from './hook'
import { useLocalization } from '@/hooks/use-localization'
import { Command as CommandPrimitive } from 'cmdk'
import { CircleHelp } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { MatchType } from '@/lib/index.types'

type Props = {
  label: string
  placeholder?: string
  value?: string[]
  candidates: Option[]
  onValueChange?: (value: string[]) => void
  matchType?: MatchType
  setMatchType?: (matchType: MatchType) => void
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'value' | 'placeholder' | 'disabled'
  >
}

export const MultiFilterItemSelector = ({
  label,
  placeholder,
  value,
  candidates,
  onValueChange,
  matchType,
  setMatchType,
  inputProps,
}: Props) => {
  const { onMatchTypeClicked } = useMultiFilterItemSelector({
    matchType,
    setMatchType,
  })
  const { t } = useLocalization()

  const formattedPlaceholder =
    placeholder === undefined
      ? t('mainsidebar:multi-filter-item-selector:placeholder')
      : placeholder

  return (
    <div>
      <div className="grid grid-cols-1 w-full overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-full flex items-center shrink min-w-0">
            <p className="text-base font-bold truncate shrink wrap-break-word">
              {label}
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleHelp className="size-4 ml-1 text-muted-foreground shrink-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('mainsidebar:help:attribute-exclude-feature-tips')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {matchType && (
            <div
              className="size-fit bg-primary text-primary-foreground py-1 px-4 rounded-full text-xs flex items-center cursor-pointer select-none shrink-0"
              onClick={onMatchTypeClicked}
            >
              {matchType === 'Unfilled'
                ? t('mainsidebar:multi-filter-item-selector:type:unfilled')
                : matchType}
            </div>
          )}
        </div>
      </div>
      <MultipleSelector
        className="mt-2"
        badgeClassName="max-w-42"
        options={candidates}
        value={value}
        onChange={onValueChange}
        placeholder={formattedPlaceholder}
        hidePlaceholderWhenSelected
        negativeSelectable
        emptyIndicator={
          <p className="text-center text-lg text-muted-foreground">
            {t('mainsidebar:multi-filter-item-selector:no-candidates')}
          </p>
        }
        inputProps={inputProps}
      />
    </div>
  )
}
