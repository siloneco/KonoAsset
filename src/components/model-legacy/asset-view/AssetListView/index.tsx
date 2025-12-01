import { AssetSummary } from '@/lib/bindings'
import { SlimAssetDetail } from '../../SlimAssetDetail'
import { AssetCardOpenButton } from '../../action-buttons/AssetCardOpenButton'
import { Button } from '@/components/ui/button'
import { NotebookText } from 'lucide-react'
import { RowVirtualScroll } from '@/components/ui/virtual-scroll'
import { useMemoDialogStore } from '@/stores/dialogs/MemoDialogStore'
import { AssetCardMeatballMenu } from '@/components/models/asset-card/AssetCardMeatballMenu'

type Props = {
  sortedAssetSummary: AssetSummary[]
  openDataManagementDialog: (assetId: string) => void
  openEditAssetDialog: (assetId: string) => void
}

export const AssetListView = ({
  sortedAssetSummary,
  openDataManagementDialog,
  openEditAssetDialog,
}: Props) => {
  const openMemoDialog = useMemoDialogStore((state) => state.open)

  const renderAssetItem = (asset: AssetSummary) => (
    <SlimAssetDetail key={asset.id} asset={asset}>
      <div className="flex flex-row items-center gap-4">
        {asset.hasMemo && (
          <Button
            variant="outline"
            className="h-8 w-8"
            onClick={() => openMemoDialog(asset.id)}
          >
            <NotebookText />
          </Button>
        )}
        <AssetCardOpenButton
          id={asset.id}
          displayOpenButtonText
          hasDependencies={asset.dependencies.length > 0}
        />
        <AssetCardMeatballMenu
          id={asset.id}
          boothItemID={asset.boothItemId ?? undefined}
          openDataManagementDialog={() => openDataManagementDialog(asset.id)}
          openEditAssetDialog={() => openEditAssetDialog(asset.id)}
        />
      </div>
    </SlimAssetDetail>
  )

  return (
    <div className="h-full">
      <RowVirtualScroll
        items={sortedAssetSummary}
        renderItem={renderAssetItem}
        estimateSize={74}
        overscan={10}
        className="h-full"
        innerDivClassName="pb-24"
      />
    </div>
  )
}
