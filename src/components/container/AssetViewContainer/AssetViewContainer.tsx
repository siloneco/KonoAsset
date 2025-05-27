import { AssetView } from '@/components/presentation/asset-view/AssetView'
import { ComponentProps, FC } from 'react'
import { useAssetViewContainer } from './hook'

type Props = Pick<
  ComponentProps<typeof AssetView>,
  | 'onMainOpenButtonClick'
  | 'openAddAssetDialog'
  | 'openDirEditDialog'
  | 'openEditAssetDialog'
  | 'openMemoDialog'
  | 'openDependencyDialog'
>

export const AssetViewContainer: FC<Props> = ({
  onMainOpenButtonClick,
  openAddAssetDialog,
  openDirEditDialog,
  openEditAssetDialog,
  openMemoDialog,
  openDependencyDialog,
}) => {
  const {
    sortedAndFilteredAssetSummaries,
    assetCardSize,
    noAssetRegistered,
    clearAssetFilters,
    language,
    onOpenManagedDirButtonClick,
    getAssetDirectoryPath,
    deleteAsset,
    setFilterAssetType,
    setCreatorNameFilter,
    resolveImageAbsolutePath,
  } = useAssetViewContainer()

  return (
    <AssetView
      sortedAndFilteredAssetSummaries={sortedAndFilteredAssetSummaries}
      assetCardSize={assetCardSize}
      noAssetRegistered={noAssetRegistered}
      openAddAssetDialog={openAddAssetDialog}
      clearAssetFilters={clearAssetFilters}
      language={language}
      onMainOpenButtonClick={onMainOpenButtonClick}
      onOpenManagedDirButtonClick={onOpenManagedDirButtonClick}
      getAssetDirectoryPath={getAssetDirectoryPath}
      openDirEditDialog={openDirEditDialog}
      openEditAssetDialog={openEditAssetDialog}
      openMemoDialog={openMemoDialog}
      openDependencyDialog={openDependencyDialog}
      deleteAsset={deleteAsset}
      setFilterAssetType={setFilterAssetType}
      setCreatorNameFilter={setCreatorNameFilter}
      resolveImageAbsolutePath={resolveImageAbsolutePath}
    />
  )
}
