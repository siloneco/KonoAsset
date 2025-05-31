import { ScrollArea } from '@/components/ui/scroll-area'
import { ComponentProps, FC } from 'react'
import { AssetViewGridLayout } from '../AssetViewGridLayout'
import { AssetViewListLayout } from '../AssetViewListLayout'
import { useAssetView } from './hook'
import { AssetCardSize } from '@/components/context/PersistentContext'
import { AssetViewBackground } from '../AssetViewBackground'
import { AssetSummary } from '@/lib/bindings'
import { cn } from '@/lib/utils'

type Props = {
  sortedAndFilteredAssetSummaries: AssetSummary[]
  assetCardSize: AssetCardSize
  openAddAssetDialog: () => void
  clearAssetFilters: () => void
  noAssetRegistered: boolean
} & Omit<ComponentProps<typeof AssetViewBackground>, 'type'> &
  Omit<
    ComponentProps<typeof AssetViewGridLayout>,
    'columnCount' | 'displaySize' | 'sortedAssetSummaries'
  > &
  Omit<ComponentProps<typeof AssetViewListLayout>, 'sortedAssetSummaries'>

export const AssetView: FC<Props> = ({
  assetCardSize,
  sortedAndFilteredAssetSummaries,
  noAssetRegistered,
  ...props
}) => {
  const { layoutDivRef, layout, gridColumnCount } = useAssetView({
    assetCardSize,
  })

  return (
    <>
      {sortedAndFilteredAssetSummaries.length === 0 && (
        <>
          <AssetViewBackground
            type={noAssetRegistered ? 'NoAssets' : 'NoResults'}
            {...props}
          />
          <div className="h-24" />
        </>
      )}
      <ScrollArea
        className={cn(
          'h-full flex justify-center items-center',
          sortedAndFilteredAssetSummaries.length === 0 && 'h-0 overflow-hidden',
        )}
        ref={layoutDivRef}
      >
        {layout === 'Grid' && (
          <AssetViewGridLayout
            sortedAssetSummaries={sortedAndFilteredAssetSummaries}
            columnCount={gridColumnCount}
            displaySize={assetCardSize === 'List' ? 'Medium' : assetCardSize}
            {...props}
          />
        )}
        {layout === 'List' && (
          <AssetViewListLayout
            sortedAssetSummaries={sortedAndFilteredAssetSummaries}
            {...props}
          />
        )}
        <div
          className={cn(
            'h-24',
            sortedAndFilteredAssetSummaries.length === 0 && 'hidden',
          )}
        />
      </ScrollArea>
    </>
  )
}
