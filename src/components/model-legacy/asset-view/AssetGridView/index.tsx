import { AssetCard } from '../../AssetCard'

import { cn } from '@/lib/utils'
import { AssetSummary, FileInfo } from '@/lib/bindings'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'

const SMALL_CARD_WIDTH = 135
const MEDIUM_CARD_WIDTH = 180
const LARGE_CARD_WIDTH = 240

type Props = {
  sortedAssetSummary: AssetSummary[]
  openSelectUnitypackageDialog: (
    assetId: string,
    data: {
      [x: string]: FileInfo[]
    },
  ) => void
  openDataManagementDialog: (assetId: string) => void
  openEditAssetDialog: (assetId: string) => void
  openMemoDialog: (assetId: string) => void
  openDependencyDialog: (assetName: string, dependencies: string[]) => void
}

export const AssetGridView = ({
  sortedAssetSummary,
  openSelectUnitypackageDialog,
  openDataManagementDialog,
  openEditAssetDialog,
  openMemoDialog,
  openDependencyDialog,
}: Props) => {
  const assetViewStyle = useAssetSummaryViewStore(
    (state) => state.assetViewStyle,
  )

  let columnWidth: number
  if (assetViewStyle === 'Small') {
    columnWidth = SMALL_CARD_WIDTH
  } else if (assetViewStyle === 'Medium') {
    columnWidth = MEDIUM_CARD_WIDTH
  } else if (assetViewStyle === 'Large') {
    columnWidth = LARGE_CARD_WIDTH
  } else {
    columnWidth = MEDIUM_CARD_WIDTH
  }

  return (
    <div
      className={cn(`grid gap-4 mx-6 pb-24`)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${columnWidth}px, 1fr))`,
      }}
    >
      {sortedAssetSummary.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          openSelectUnitypackageDialog={openSelectUnitypackageDialog}
          openDataManagementDialog={openDataManagementDialog}
          openEditAssetDialog={openEditAssetDialog}
          openMemoDialog={openMemoDialog}
          openDependencyDialog={openDependencyDialog}
        />
      ))}
    </div>
  )
}
