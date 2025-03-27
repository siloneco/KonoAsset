import { FC } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import SelectUnitypackageDialog from '../../AssetCard/components/SelectUnitypackageDialog'
import DataManagementDialog from '../../AssetCard/components/MoreButton/components/DataManagementDialog'
import EditAssetDialog from '../../asset-dialogs/EditAssetDialog'
import MemoDialog from '../../MemoDialog'
import { DependencyDialog } from '../../DependencyDialog'
import { useAssetView } from './hook'
import { AssetViewBackground } from '../AssetViewBackground'
import { AssetGridView } from '../AssetGridView'

type Props = {
  openAddAssetDialog: () => void
  setShowingAssetCount: (count: number) => void
}

export const AssetView: FC<Props> = ({
  openAddAssetDialog,
  setShowingAssetCount,
}) => {
  const {
    sortedAssetSummary,
    layoutDivRef,
    gridColumnCount,
    background,

    openSelectUnitypackageDialog,
    openDataManagementDialog,
    openEditAssetDialog,
    openMemoDialog,
    openDependencyDialog,

    setSelectUnitypackageDialogOpen,
    setDataManagementDialogOpen,
    setEditAssetDialogOpen,
    setMemoDialogOpen,
    setDependencyDialogOpen,

    selectUnitypackageDialogOpen,
    selectUnitypackageDialogAssetId,
    unitypackages,
    dataManagementDialogAssetId,
    dataManagementDialogOpen,
    editAssetDialogAssetId,
    editAssetDialogOpen,
    memoDialogAssetId,
    memoDialogOpen,
    dependencyDialogOpen,
    dependencyDialogAssetName,
    dependencyDialogDependencies,
  } = useAssetView({
    setShowingAssetCount,
  })

  return (
    <ScrollArea ref={layoutDivRef}>
      {sortedAssetSummary.length === 0 && (
        <AssetViewBackground
          type={background}
          openDialog={openAddAssetDialog}
        />
      )}
      <div>
        <AssetGridView
          sortedAssetSummary={sortedAssetSummary}
          columnCount={gridColumnCount}
          openSelectUnitypackageDialog={openSelectUnitypackageDialog}
          openDataManagementDialog={openDataManagementDialog}
          openEditAssetDialog={openEditAssetDialog}
          openMemoDialog={openMemoDialog}
          openDependencyDialog={openDependencyDialog}
        />
      </div>
      <SelectUnitypackageDialog
        dialogOpen={selectUnitypackageDialogOpen}
        setDialogOpen={setSelectUnitypackageDialogOpen}
        assetId={selectUnitypackageDialogAssetId}
        unitypackageFiles={unitypackages}
      />
      <DataManagementDialog
        assetId={dataManagementDialogAssetId}
        open={dataManagementDialogOpen}
        onOpenChange={setDataManagementDialogOpen}
      />
      <EditAssetDialog
        id={editAssetDialogAssetId}
        dialogOpen={editAssetDialogOpen}
        setDialogOpen={setEditAssetDialogOpen}
      />
      <MemoDialog
        assetId={memoDialogAssetId}
        dialogOpen={memoDialogOpen}
        setDialogOpen={setMemoDialogOpen}
      />
      <DependencyDialog
        dialogOpen={dependencyDialogOpen}
        setDialogOpen={setDependencyDialogOpen}
        assetName={dependencyDialogAssetName}
        dependencyIds={dependencyDialogDependencies}
      />
    </ScrollArea>
  )
}
