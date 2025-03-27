import AssetCard from '../../AssetCard'

import { cn } from '@/lib/utils'
import { AssetSummary, FileInfo } from '@/lib/bindings'

type Props = {
  sortedAssetSummary: AssetSummary[]
  columnCount: number
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

export const AssetListView = ({
  sortedAssetSummary,
  columnCount,
  openSelectUnitypackageDialog,
  openDataManagementDialog,
  openEditAssetDialog,
  openMemoDialog,
  openDependencyDialog,
}: Props) => {
  return (
    <div
      className={cn(`grid gap-4 m-6 mt-0`)}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
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
