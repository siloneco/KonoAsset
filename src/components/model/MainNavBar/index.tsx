import { PersistentContext } from '@/components/context/PersistentContext'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useContext } from 'react'
import { convertToSelectID, handleSortByChange } from './logic'
import { AssetContext } from '@/components/context/AssetContext'
import { Button } from '@/components/ui/button'

type Props = {
  className?: string
  displayAssetCount?: number
}

const NavBar = ({ className, displayAssetCount }: Props) => {
  const { sortBy, setSortBy, reverseOrder, setReverseOrder, clearFilters } =
    useContext(PersistentContext)
  const { assetDisplaySortedList } = useContext(AssetContext)

  const totalAssetCount = assetDisplaySortedList.length
  const showingCount = displayAssetCount ?? totalAssetCount

  return (
    <div className={cn('p-4', className)}>
      <div className="flex flex-row w-full">
        <div className="w-full">
          <Card className="min-h-10 flex items-center">
            <div className="lg:w-28" />
            <div className="my-auto ml-4 lg:mx-auto">
              <span className="text-foreground/70">
                {totalAssetCount}個のアセットのうち
              </span>
              <span className="text-card-foreground font-bold px-2 rounded-lg">
                {showingCount}個
              </span>
              <span className="text-foreground/70">を表示中</span>
            </div>
            <div className="w-28 ml-auto mr-2">
              {totalAssetCount !== showingCount && (
                <Button
                  className="h-8"
                  variant={'outline'}
                  onClick={clearFilters}
                >
                  フィルタをクリア
                </Button>
              )}
            </div>
          </Card>
        </div>
        <div className="w-fit mx-2 flex items-center">
          <Select
            value={convertToSelectID(sortBy, reverseOrder)}
            onValueChange={(value) =>
              handleSortByChange({ value, setSortBy, setReverseOrder })
            }
            defaultValue="CreatedAtDesc"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ソート設定" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="CreatedAtDesc">
                  追加順 (新しいものから)
                </SelectItem>
                <SelectItem value="CreatedAtAsc">
                  追加順 (古いものから)
                </SelectItem>
                <SelectItem value="NameAsc">アセット名 (A-Z順)</SelectItem>
                <SelectItem value="NameDesc">アセット名 (Z-A順)</SelectItem>
                <SelectItem value="CreatorAsc">ショップ名 (A-Z順)</SelectItem>
                <SelectItem value="CreatorDesc">ショップ名 (Z-A順)</SelectItem>
                <SelectItem value="PublishedAtDesc">
                  商品公開日 (新しいものから)
                </SelectItem>
                <SelectItem value="PublishedAtAsc">
                  商品公開日 (古いものから)
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default NavBar
