import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { Label } from '@/components/ui/label'
import { useMultiFilterItemSelector } from './hook'
import { MatchType } from '@/lib/bindings'
import { useLocalization } from '@/hooks/use-localization'
import { Command as CommandPrimitive } from 'cmdk'
import { CircleHelp } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
      <div className="flex flex-row">
        <div className="w-full flex flex-row items-center">
          <Label className="text-base">{label}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className="size-4 ml-1 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('mainsidebar:help:not-feature-tips')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {matchType && (
          <div
            className="space-x-2 bg-primary text-primary-foreground px-4 rounded-full text-[12px] flex items-center cursor-pointer select-none"
            onClick={onMatchTypeClicked}
          >
            <span>{matchType}</span>
          </div>
        )}
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
