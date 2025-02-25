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
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  className?: string
  displayAssetCount?: number
}

const NavBar = ({ className, displayAssetCount }: Props) => {
  const { sortBy, setSortBy, reverseOrder, setReverseOrder, clearFilters } =
    useContext(PersistentContext)
  const { assetDisplaySortedList } = useContext(AssetContext)

  const { t } = useLocalization()
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
                {totalAssetCount}
                {t('mainnavbar:total-asset-count')}
              </span>
              <span className="text-card-foreground font-bold px-2 rounded-lg">
                {showingCount}
                {t('general:count')}
              </span>
              <span className="text-foreground/70">
                {t('mainnavbar:showing')}
              </span>
            </div>
            <div className="w-28 ml-auto mr-2">
              {totalAssetCount !== showingCount && (
                <Button
                  className="h-8"
                  variant={'outline'}
                  onClick={clearFilters}
                >
                  {t('general:clear-filter')}
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
              <SelectValue placeholder={t('mainnavbar:sort-settings')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="CreatedAtDesc">
                  {t('mainnavbar:sort-settings:created-at-desc')}
                </SelectItem>
                <SelectItem value="CreatedAtAsc">
                  {t('mainnavbar:sort-settings:created-at-asc')}
                </SelectItem>
                <SelectItem value="NameAsc">
                  {t('mainnavbar:sort-settings:asset-name-asc')}
                </SelectItem>
                <SelectItem value="NameDesc">
                  {t('mainnavbar:sort-settings:asset-name-desc')}
                </SelectItem>
                <SelectItem value="CreatorAsc">
                  {t('mainnavbar:sort-settings:shop-name-asc')}
                </SelectItem>
                <SelectItem value="CreatorDesc">
                  {t('mainnavbar:sort-settings:shop-name-desc')}
                </SelectItem>
                <SelectItem value="PublishedAtDesc">
                  {t('mainnavbar:sort-settings:published-at-desc')}
                </SelectItem>
                <SelectItem value="PublishedAtAsc">
                  {t('mainnavbar:sort-settings:published-at-asc')}
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
