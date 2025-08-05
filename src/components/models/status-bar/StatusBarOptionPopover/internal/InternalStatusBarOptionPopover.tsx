import { FC } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ArrowDownAz, ChevronDown, Minus, Proportions } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StatusBarOptionLayoutSection } from '../../StatusBarOptionLayoutSection'
import { StatusBarOptionSortSection } from '../../StatusBarOptionSortSection'

type Props = {
  displayLayoutValue: string
  sortValue: string
  setSort: (value: string) => void
  setDisplayLayout: (value: string) => void
}

export const InternalStatusBarOptionPopover: FC<Props> = ({
  displayLayoutValue,
  sortValue,
  setSort,
  setDisplayLayout,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-row text-muted-foreground"
          data-testid="status-bar-option-popover-trigger"
        >
          <div className="flex flex-row">
            <Proportions className="size-6" />
            <Minus className="rotate-90 size-6" />
            <ArrowDownAz className="size-6" />
          </div>
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit mr-2 p-2 flex flex-row">
        <StatusBarOptionLayoutSection
          value={displayLayoutValue}
          setValue={setDisplayLayout}
        />
        <Separator orientation="vertical" className="h-52 mx-2 my-auto" />
        <StatusBarOptionSortSection value={sortValue} setValue={setSort} />
      </PopoverContent>
    </Popover>
  )
}
