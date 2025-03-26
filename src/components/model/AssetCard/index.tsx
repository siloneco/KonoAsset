import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { MoreButton } from './components/MoreButton'
import { useAssetCard } from './hook'
import AssetBadge from '@/components/part/AssetBadge'
import { Label } from '@/components/ui/label'
import { RefObject, useContext } from 'react'
import SquareImage from '@/components/model/SquareImage'
import { PersistentContext } from '@/components/context/PersistentContext'
import { AssetSummary, FileInfo } from '@/lib/bindings'
import AssetCardOpenButton from '@/components/model/AssetCard/components/AssetCardOpenButton'
import { Button } from '@/components/ui/button'
import { NotebookText } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  asset: AssetSummary
  ref?: RefObject<HTMLDivElement | null>

  openSelectUnitypackageDialog: () => void
  setUnitypackageFiles: (data: { [x: string]: FileInfo[] }) => void
  setDialogAssetId: (assetId: string | null) => void

  openDataManagementDialog: (assetId: string) => void
  openEditAssetDialog: (assetId: string) => void
  openMemoDialog: (assetId: string) => void
  openDependencyDialog: (assetName: string, dependencyIds: string[]) => void
}

const AssetCard = ({
  asset,
  ref,
  openSelectUnitypackageDialog,
  setUnitypackageFiles,
  setDialogAssetId,
  openDataManagementDialog,
  openEditAssetDialog,
  openMemoDialog,
  openDependencyDialog,
}: Props) => {
  const { deleteAsset } = useAssetCard({ asset })
  const {
    assetCardSize,
    setAssetType,
    setQueryTextMode,
    setQueryTextFilterForCreator,
  } = useContext(PersistentContext)

  const onShopNameClicked = () => {
    setQueryTextMode('advanced')
    setQueryTextFilterForCreator(asset.creator)
  }

  return (
    <Card className="w-full bg-card m-1" ref={ref}>
      <CardContent className="p-4 h-full">
        <div className="h-[calc(100%-3rem)]">
          <SquareImage
            assetType={asset.assetType}
            filename={asset.imageFilename ?? undefined}
          />
          <div className="mt-2 h-8 flex flex-row justify-between items-center text-center">
            <AssetBadge
              type={asset.assetType}
              className="select-none cursor-pointer"
              onClick={() => setAssetType(asset.assetType)}
            />
            {asset.hasMemo && (
              <Button
                variant="outline"
                className="h-8 w-8"
                onClick={() => openMemoDialog(asset.id)}
              >
                <NotebookText />
              </Button>
            )}
          </div>
          <CardTitle
            className={cn(
              'text-lg mt-2 break-words whitespace-pre-wrap',
              assetCardSize === 'Small' && 'text-base',
            )}
          >
            {asset.name}
          </CardTitle>
          <Label className="text-sm cursor-pointer" onClick={onShopNameClicked}>
            {asset.creator}
          </Label>
        </div>
        <div className="flex flex-row mt-2">
          <AssetCardOpenButton
            className="w-full mr-2"
            id={asset.id}
            hasDependencies={asset.dependencies.length > 0}
            openSelectUnitypackageDialog={openSelectUnitypackageDialog}
            setUnitypackageFiles={(obj) => {
              setUnitypackageFiles(obj)
              setDialogAssetId(asset.id)
            }}
            openDependencyDialog={() =>
              openDependencyDialog(asset.name, asset.dependencies)
            }
          />
          <MoreButton
            executeAssetDeletion={deleteAsset}
            boothItemID={asset.boothItemId ?? undefined}
            openDataManagementDialog={() => {
              openDataManagementDialog(asset.id)
            }}
            openEditAssetDialog={() => {
              openEditAssetDialog(asset.id)
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default AssetCard
