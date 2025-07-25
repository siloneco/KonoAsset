import { AssetSummary, FileInfo } from '@/lib/bindings'
import { SlimAssetDetail } from '../../SlimAssetDetail'
import { AssetCardOpenButton } from '../../action-buttons/AssetCardOpenButton'
import { MoreButton } from '../../action-buttons/MoreButton'
import { Button } from '@/components/ui/button'
import { NotebookText } from 'lucide-react'
import { RowVirtualScroll } from '@/components/ui/virtual-scroll'
import { useMemoDialogStore } from '@/stores/dialogs/MemoDialogStore'

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
  openDependencyDialog: (assetName: string, dependencies: string[]) => void
}

export const AssetListView = ({
  sortedAssetSummary,
  openSelectUnitypackageDialog,
  openDataManagementDialog,
  openEditAssetDialog,
  openDependencyDialog,
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
          openDependencyDialog={() =>
            openDependencyDialog(asset.name, asset.dependencies)
          }
          openSelectUnitypackageDialog={openSelectUnitypackageDialog}
        />
        <MoreButton
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
