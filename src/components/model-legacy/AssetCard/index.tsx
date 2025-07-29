import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { MoreButton } from '../action-buttons/MoreButton'
import { RefObject, useCallback } from 'react'
import { SquareImage } from '@/components/model-legacy/SquareImage'
import { AssetSummary, FileInfo } from '@/lib/bindings'
import { AssetCardOpenButton } from '@/components/model-legacy/action-buttons/AssetCardOpenButton'
import { Button } from '@/components/ui/button'
import { NotebookText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'
import { useAssetFilterStore } from '@/stores/AssetFilterStore'
import { AssetCardTypeBadge } from '@/components/models/asset-card/AssetCardTypeBadge'
import { useMemoDialogStore } from '@/stores/dialogs/MemoDialogStore'

type Props = {
  asset: AssetSummary
  ref?: RefObject<HTMLDivElement | null>

  openSelectUnitypackageDialog: (
    assetId: string,
    data: { [x: string]: FileInfo[] },
  ) => void
  openDataManagementDialog: (assetId: string) => void
  openEditAssetDialog: (assetId: string) => void
}

export const AssetCard = ({
  asset,
  ref,
  openSelectUnitypackageDialog,
  openDataManagementDialog,
  openEditAssetDialog,
}: Props) => {
  const updateFilter = useAssetFilterStore((state) => state.updateFilter)
  const displayStyle = useAssetSummaryViewStore((state) => state.displayStyle)

  const openMemoDialog = useMemoDialogStore((state) => state.open)

  const onShopNameClicked = useCallback(() => {
    updateFilter({
      text: {
        mode: 'advanced',
        advancedCreatorQuery: asset.creator,
      },
    })
  }, [updateFilter, asset.creator])

  return (
    <Card className="w-full bg-card m-1 py-0" ref={ref}>
      <CardContent className="p-4 w-full h-full">
        <div className="h-[calc(100%-3rem)] w-full mb-4">
          <SquareImage
            assetType={asset.assetType}
            filename={asset.imageFilename ?? undefined}
          />
          <div className="mt-2 h-8 w-full flex flex-row justify-between items-center gap-2">
            <AssetCardTypeBadge
              type={asset.assetType}
              onClick={() => updateFilter({ assetType: asset.assetType })}
            />
            {asset.hasMemo && (
              <Button
                variant="outline"
                className="size-8"
                onClick={() => openMemoDialog(asset.id)}
              >
                <NotebookText />
              </Button>
            )}
          </div>
          <CardTitle
            className={cn(
              'text-lg mt-2 break-words whitespace-pre-wrap line-clamp-2',
              displayStyle === 'GridSmall' && 'text-base',
            )}
          >
            {asset.name}
          </CardTitle>
          <p
            className="text-sm font-normal select-text cursor-pointer text-muted-foreground truncate"
            onClick={onShopNameClicked}
          >
            {asset.creator}
          </p>
        </div>
        <div className="flex flex-row w-full mt-2 space-x-2">
          <AssetCardOpenButton
            id={asset.id}
            hasDependencies={asset.dependencies.length > 0}
            displayOpenButtonText={displayStyle !== 'GridSmall'}
            openSelectUnitypackageDialog={openSelectUnitypackageDialog}
          />
          <MoreButton
            id={asset.id}
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
