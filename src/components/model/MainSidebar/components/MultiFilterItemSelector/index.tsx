import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { Label } from '@/components/ui/label'
import { useMultiFilterItemSelector } from './hook'
import { MatchType } from '@/lib/bindings'

type Props = {
  label: string
  placeholder?: string
  value?: Option[]
  candidates: Option[]
  onValueChange?: (value: Option[]) => void
  matchType?: MatchType
  setMatchType?: (matchType: MatchType) => void
}

const MultiFilterItemSelector = ({
  label,
  placeholder,
  value,
  candidates,
  onValueChange,
  matchType,
  setMatchType,
}: Props) => {
  const { onMatchTypeClicked } = useMultiFilterItemSelector({
    matchType,
    setMatchType,
  })

  const formattedPlaceholder =
    placeholder === undefined ? 'アイテムを選択...' : placeholder

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
        options={candidates}
        value={value}
        onChange={onValueChange}
        placeholder={formattedPlaceholder}
        hidePlaceholderWhenSelected
        emptyIndicator={
          <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
            候補がありません
          </p>
        }
      />
    </div>
  )
}

export default MultiFilterItemSelector
