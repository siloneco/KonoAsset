import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { Label } from '@/components/ui/label'
import { useMultiFilterItemSelector } from './hook'
import { MatchType } from '@/lib/bindings'
import { useLocalization } from '@/hooks/use-localization'
import { Command as CommandPrimitive } from 'cmdk'

type Props = {
  label: string
  placeholder?: string
  value?: Option[]
  candidates: Option[]
  onValueChange?: (value: Option[]) => void
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
        <Label className="text-base w-full">{label}</Label>
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
