import { AssetCard } from '../../AssetCard'
import { AssetSummary, FileInfo } from '@/lib/bindings'
import { RowVirtualScroll } from '@/components/ui/virtual-scroll'
import { useAssetGridView } from './hook'

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
  const { assetRows, gridColumnCount, divRef } = useAssetGridView({
    sortedAssetSummary,
  })

  const renderAssetRow = (assetRow: AssetSummary[]) => (
    <div
      className="grid gap-4 w-full"
      style={{
        gridTemplateColumns: `repeat(${gridColumnCount}, minmax(0, 1fr))`,
      }}
    >
      {assetRow.map((asset) => (
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

  return (
    <div className="h-full" ref={divRef}>
      <RowVirtualScroll
        items={assetRows}
        renderItem={renderAssetRow}
        estimateSize={350}
        className="h-full"
        innerDivClassName="pb-24"
      />
    </div>
  )
}
