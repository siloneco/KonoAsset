import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { FC } from 'react'
import { AssetSummary, AssetType, LanguageCode, Result } from '@/lib/bindings'
import { cn } from '@/lib/utils'
import { AssetCardMeatballMenu } from '../AssetCardMeatballMenu'
import { useAssetCard } from './hook'
import { AssetCardOpenButton } from '../AssetCardOpenButton'
import { AssetCardSize } from '@/components/context/PersistentContext'
import { AssetCardTypeBadge } from '../AssetCardTypeBadge'
import { SquareImage } from '../../square-image/SquareImage'
import { AssetCardOpenMemoDialogButton } from '../AssetCardOpenMemoDialogButton'

type Props = {
  asset: AssetSummary
  language: LanguageCode
  displaySize: Exclude<AssetCardSize, 'List'>

  onMainOpenButtonClick: (assetId: string) => Promise<boolean>
  onOpenManagedDirButtonClick: (assetId: string) => Promise<void>
  getAssetDirectoryPath: (assetId: string) => Promise<Result<string, string>>
  openDirEditDialog: (assetId: string) => Promise<void>
  openEditAssetDialog: (assetId: string) => Promise<void>
  openMemoDialog: (assetId: string) => Promise<void>
  openDependencyDialog: (assetId: string) => Promise<void>
  deleteAsset: (assetId: string) => Promise<void>
  setFilterAssetType: (assetType: AssetType) => void
  setCreatorNameFilter: (creatorName: string) => void
  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
}

export const AssetCard: FC<Props> = ({
  asset,
  language,
  displaySize,
  onMainOpenButtonClick,
  onOpenManagedDirButtonClick,
  getAssetDirectoryPath,
  openDirEditDialog,
  openEditAssetDialog,
  openMemoDialog,
  openDependencyDialog,
  deleteAsset,
  setFilterAssetType,
  setCreatorNameFilter,
  resolveImageAbsolutePath,
}) => {
  const {
    imageSrc,
    imageLoading,
    onAssetTypeBadgeClick,
    onShopNameClick,
    onCopyPathButtonClick,
  } = useAssetCard({
    asset,
    getAssetDirectoryPath,
    setFilterAssetType,
    setCreatorNameFilter,
    resolveImageAbsolutePath,
  })

  return (
    <Card className="w-full bg-card m-1 py-0">
      <CardContent className="p-4 w-full h-full">
        <div className="h-[calc(100%-3rem)] w-full">
          <SquareImage
            assetType={asset.assetType}
            src={imageSrc}
            loading={imageLoading}
          />
          <div className="mt-2 h-8 w-full flex flex-row justify-between items-center text-center">
            <div className="flex shrink overflow-hidden">
              <AssetCardTypeBadge
                type={asset.assetType}
                className="select-none w-full"
                onClick={onAssetTypeBadgeClick}
              />
            </div>
            {asset.hasMemo && (
              <AssetCardOpenMemoDialogButton
                openMemoDialog={() => openMemoDialog(asset.id)}
              />
            )}
          </div>
          <CardTitle
            className={cn('text-lg mt-2 break-words whitespace-pre-wrap', {
              'text-base': displaySize === 'Small',
            })}
          >
            {asset.name}
          </CardTitle>
          <Label
            className="text-sm cursor-pointer select-text text-muted-foreground font-normal"
            onClick={onShopNameClick}
          >
            {asset.creator}
          </Label>
        </div>
        <div className="flex flex-row w-full mt-2 space-x-2">
          <AssetCardOpenButton
            hideOpenButtonText={displaySize === 'Small'}
            onDependencyDialogButtonClick={
              asset.dependencies.length > 0
                ? () => openDependencyDialog(asset.id)
                : null
            }
            onOpenButtonClick={() => onMainOpenButtonClick(asset.id)}
            onOpenManagedDirButtonClick={() =>
              onOpenManagedDirButtonClick(asset.id)
            }
            onCopyPathButtonClick={onCopyPathButtonClick}
          />
          <AssetCardMeatballMenu
            language={language}
            boothItemId={asset.boothItemId}
            openDirEditDialog={() => openDirEditDialog(asset.id)}
            openEditAssetDialog={() => openEditAssetDialog(asset.id)}
            deleteAsset={() => deleteAsset(asset.id)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
