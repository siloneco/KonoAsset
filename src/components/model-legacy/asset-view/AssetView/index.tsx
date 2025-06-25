import { FC } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SelectUnitypackageDialog } from '../../SelectUnitypackageDialog'
import { MemoDialog } from '../../MemoDialog'
import { DependencyDialog } from '../../DependencyDialog'
import { useAssetView } from './hook'
import { AssetViewBackground } from '../AssetViewBackground'
import { AssetGridView } from '../AssetGridView'
import { AssetListView } from '../AssetListView'

type Props = {
  openAddAssetDialog: () => void
  openEditAssetDialog: (assetId: string) => void
  openDataManagementDialog: (assetId: string) => void
  setShowingAssetCount: (count: number) => void
}

export const AssetView: FC<Props> = ({
  openAddAssetDialog,
  openEditAssetDialog,
  openDataManagementDialog,
  setShowingAssetCount,
}) => {
  const {
    sortedAssetSummary,
    displayStyle,
    background,

    openSelectUnitypackageDialog,
    openMemoDialog,
    openDependencyDialog,

    setSelectUnitypackageDialogOpen,
    setMemoDialogOpen,
    setDependencyDialogOpen,

    selectUnitypackageDialogOpen,
    selectUnitypackageDialogAssetId,
    unitypackages,
    memoDialogAssetId,
    memoDialogOpen,
    dependencyDialogOpen,
    dependencyDialogAssetName,
    dependencyDialogDependencies,
  } = useAssetView({
    setShowingAssetCount,
  })

  return (
    <ScrollArea className="h-[calc(100vh-72px)]">
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
