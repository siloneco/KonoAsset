import { cn } from '@/lib/utils'
import { AssetSummary, FileInfo } from '@/lib/bindings'
import { SlimAssetDetail } from '../../SlimAssetDetail'
import { AssetCardOpenButton } from '../../action-buttons/AssetCardOpenButton'
import { MoreButton } from '../../action-buttons/MoreButton'
import { Button } from '@/components/ui/button'
import { NotebookText } from 'lucide-react'

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

export const AssetListView = ({
  sortedAssetSummary,
  openSelectUnitypackageDialog,
  openDataManagementDialog,
  openEditAssetDialog,
  openMemoDialog,
  openDependencyDialog,
}: Props) => {
  return (
    <div className={cn(`grid gap-2 grid-cols-1 mx-4 pb-24`)}>
      {sortedAssetSummary.map((asset) => (
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
              openDataManagementDialog={() =>
                openDataManagementDialog(asset.id)
              }
              openEditAssetDialog={() => openEditAssetDialog(asset.id)}
            />
          </div>
        </SlimAssetDetail>
      ))}
    </div>
  )
}
