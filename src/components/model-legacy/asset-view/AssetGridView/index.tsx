import { AssetCard } from '../../AssetCard'
import { AssetSummary } from '@/lib/bindings'
import { RowVirtualScroll } from '@/components/ui/virtual-scroll'
import { useAssetGridView } from './hook'

type Props = {
  layoutDivRef: React.RefObject<HTMLDivElement | null>
  sortedAssetSummary: AssetSummary[]
  openEditAssetDialog: (assetId: string) => void
}

export const AssetGridView = ({
  layoutDivRef,
  sortedAssetSummary,
  openEditAssetDialog,
}: Props) => {
  const { assetRows, gridColumnCount } = useAssetGridView({
    sortedAssetSummary,
    layoutDivRef,
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
          openEditAssetDialog={openEditAssetDialog}
        />
      ))}
    </div>
  )

  return (
    <RowVirtualScroll
      items={assetRows}
      renderItem={renderAssetRow}
      estimateSize={350}
      className="h-full"
      innerDivClassName="pb-24"
    />
  )
}
