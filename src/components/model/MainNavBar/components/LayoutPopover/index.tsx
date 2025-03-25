import { FC, useContext } from 'react'
import {
  AssetCardSize,
  PersistentContext,
} from '@/components/context/PersistentContext'
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

export const LayoutPopover: FC = () => {
  const {
    sortBy,
    setSortBy,
    assetCardSize,
    setAssetCardSize,
    reverseOrder,
    setReverseOrder,
  } = useContext(PersistentContext)

  const currentOrder = convertToSelectID(sortBy, reverseOrder)
  const setOrder = (value: string) => {
    handleSortByChange({ value, setSortBy, setReverseOrder })
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="outline"
          className="flex flex-row text-muted-foreground"
        >
          <div className="flex flex-row [&_svg]:size-6">
            <Proportions />
            <Minus className="rotate-90" />
            <ArrowDownAz />
          </div>
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit mr-2 p-2 flex flex-row">
        <SizeSelector
          current={assetCardSize}
          setValue={(value) => setAssetCardSize(value as AssetCardSize)}
        />
        <Separator orientation="vertical" className="h-52 mx-2 my-auto" />
        <OrderSelector current={currentOrder} setValue={setOrder} />
      </PopoverContent>
    </Popover>
  )
}
