import { FC } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import SelectUnitypackageDialog from '../../SelectUnitypackageDialog'
import EditAssetDialog from '../../asset-dialogs/EditAssetDialog'
import MemoDialog from '../../MemoDialog'
import { DependencyDialog } from '../../DependencyDialog'
import { useAssetView } from './hook'
import { AssetViewBackground } from '../AssetViewBackground'
import { AssetGridView } from '../AssetGridView'
import { AssetListView } from '../AssetListView'

type Props = {
  openAddAssetDialog: () => void
  openDataManagementDialog: (assetId: string) => void
  setShowingAssetCount: (count: number) => void
}

export const AssetView: FC<Props> = ({
  openAddAssetDialog,
  openDataManagementDialog,
  setShowingAssetCount,
}) => {
  const {
    sortedAssetSummary,
    layoutDivRef,
    gridColumnCount,
    displayStyle,
    background,

    openSelectUnitypackageDialog,
    openEditAssetDialog,
    openMemoDialog,
    openDependencyDialog,

    setSelectUnitypackageDialogOpen,
    setEditAssetDialogOpen,
    setMemoDialogOpen,
    setDependencyDialogOpen,

    selectUnitypackageDialogOpen,
    selectUnitypackageDialogAssetId,
    unitypackages,
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
    <ScrollArea ref={layoutDivRef} className="h-[calc(100vh-72px)]">
      {sortedAssetSummary.length === 0 && (
        <AssetViewBackground
          type={background}
          openDialog={openAddAssetDialog}
        />
      )}
      <div>
        {displayStyle === 'Grid' && (
          <AssetGridView
            sortedAssetSummary={sortedAssetSummary}
            columnCount={gridColumnCount}
            openSelectUnitypackageDialog={openSelectUnitypackageDialog}
            openDataManagementDialog={openDataManagementDialog}
            openEditAssetDialog={openEditAssetDialog}
            openMemoDialog={openMemoDialog}
            openDependencyDialog={openDependencyDialog}
          />
        )}
        {displayStyle === 'List' && (
          <AssetListView
            sortedAssetSummary={sortedAssetSummary}
            openSelectUnitypackageDialog={openSelectUnitypackageDialog}
            openDataManagementDialog={openDataManagementDialog}
            openEditAssetDialog={openEditAssetDialog}
            openMemoDialog={openMemoDialog}
            openDependencyDialog={openDependencyDialog}
          />
        )}
      </div>
      <SelectUnitypackageDialog
        dialogOpen={selectUnitypackageDialogOpen}
        setDialogOpen={setSelectUnitypackageDialogOpen}
        assetId={selectUnitypackageDialogAssetId}
        unitypackageFiles={unitypackages}
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
        openDependencyDialog={openDependencyDialog}
        openSelectUnitypackageDialog={openSelectUnitypackageDialog}
      />
    </ScrollArea>
  )
}
