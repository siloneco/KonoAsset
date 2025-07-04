import { FC, useCallback, useMemo } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ArrowDownAz, ChevronDown, Minus, Proportions } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { convertToSelectID, handleSortByChange } from './logic'
import { OrderSelector } from '../OrderSelector'
import { Separator } from '@/components/ui/separator'
import { SizeSelector } from '../SizeSelector'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'

import { useShallow } from 'zustand/react/shallow'
import { DisplayStyle } from '@/lib/bindings'

export const LayoutPopover: FC = () => {
  const { sortBy, reverseOrder, setSort, displayStyle, setDisplayStyle } =
    useAssetSummaryViewStore(
      useShallow((state) => ({
        sortBy: state.sortBy,
        reverseOrder: state.reverseOrder,
        setSort: state.setSort,
        displayStyle: state.displayStyle,
        setDisplayStyle: state.setDisplayStyle,
      })),
    )

  const currentOrder = useMemo(
    () => convertToSelectID(sortBy, reverseOrder),
    [sortBy, reverseOrder],
  )

  const setOrder = useCallback(
    (value: string) => {
      handleSortByChange({ value, setSort })
    },
    [setSort],
  )

  const setViewStyle = useCallback(
    (value: string) => {
      setDisplayStyle(value as DisplayStyle)
    },
    [setDisplayStyle],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-row text-muted-foreground"
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
        <SizeSelector current={displayStyle} setValue={setViewStyle} />
        <Separator orientation="vertical" className="h-52 mx-2 my-auto" />
        <OrderSelector current={currentOrder} setValue={setOrder} />
      </PopoverContent>
    </Popover>
  )
}
