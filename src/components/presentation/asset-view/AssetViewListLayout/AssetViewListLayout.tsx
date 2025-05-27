import { cn } from '@/lib/utils'
import { AssetSummary, LanguageCode, Result } from '@/lib/bindings'
import { ComponentProps, FC } from 'react'
import { AssetCardListStyle } from '../../asset-card/AssetCardListStyle'
import { AssetCardOpenButton } from '../../asset-card/AssetCardOpenButton'
import { AssetCardMeatballMenu } from '../../asset-card/AssetCardMeatballMenu'
import { AssetCardOpenMemoDialogButton } from '../../asset-card/AssetCardOpenMemoDialogButton'
import { useAssetViewListLayout } from './hook'

type Props = {
  sortedAssetSummaries: AssetSummary[]

  // AssetCardOpenMemoDialogButton
  openMemoDialog: (assetId: string) => Promise<void>

  // AssetCardOpenButton
  onMainOpenButtonClick: (assetId: string) => Promise<boolean>
  onOpenManagedDirButtonClick: (assetId: string) => Promise<void>
  getAssetDirectoryPath: (assetId: string) => Promise<Result<string, string>>
  openDependencyDialog: (assetId: string) => Promise<void>

  // AssetCardMeatballMenu
  language: LanguageCode
  openDirEditDialog: (assetId: string) => Promise<void>
  openEditAssetDialog: (assetId: string) => Promise<void>
  deleteAsset: (assetId: string) => Promise<void>
} & Pick<ComponentProps<typeof AssetCardListStyle>, 'resolveImageAbsolutePath'>

export const AssetViewListLayout: FC<Props> = ({
  sortedAssetSummaries,
  resolveImageAbsolutePath,
  openMemoDialog,
  onMainOpenButtonClick,
  onOpenManagedDirButtonClick,
  getAssetDirectoryPath,
  openDependencyDialog,
  language,
  openDirEditDialog,
  openEditAssetDialog,
  deleteAsset,
}) => {
  const { onCopyPathButtonClick } = useAssetViewListLayout({
    getAssetDirectoryPath,
  })

  return (
    <div className={cn(`grid gap-2 grid-cols-1 mx-4`)}>
      {sortedAssetSummaries.map((asset) => (
        <AssetCardListStyle
          key={asset.id}
          asset={asset}
          resolveImageAbsolutePath={resolveImageAbsolutePath}
        >
          <AssetCardOpenMemoDialogButton
            openMemoDialog={() => openMemoDialog(asset.id)}
          />
          <AssetCardOpenButton
            onDependencyDialogButtonClick={
              asset.dependencies.length > 0
                ? () => openDependencyDialog(asset.id)
                : null
            }
            onOpenButtonClick={() => onMainOpenButtonClick(asset.id)}
            onOpenManagedDirButtonClick={() =>
              onOpenManagedDirButtonClick(asset.id)
            }
            onCopyPathButtonClick={() => onCopyPathButtonClick(asset.id)}
          />
          <AssetCardMeatballMenu
            boothItemId={asset.boothItemId}
            language={language}
            openDirEditDialog={() => openDirEditDialog(asset.id)}
            openEditAssetDialog={() => openEditAssetDialog(asset.id)}
            deleteAsset={() => deleteAsset(asset.id)}
          />
        </AssetCardListStyle>
      ))}
    </div>
  )
}
