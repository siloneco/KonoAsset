import { FC } from 'react'
import { SelectUnitypackageDialog } from '../../SelectUnitypackageDialog'
import { DependencyDialog } from '../../DependencyDialog'
import { useAssetView } from './hook'
import { AssetViewBackground } from '../AssetViewBackground'
import { AssetGridView } from '../AssetGridView'
import { AssetListView } from '../AssetListView'
import { MemoDialog } from '@/components/models/memo-dialog/MemoDialog'

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
    layoutDivRef,
    sortedAssetSummary,
    displayStyle,
    background,

    openSelectUnitypackageDialog,
    openDependencyDialog,

    setSelectUnitypackageDialogOpen,
    setDependencyDialogOpen,

    selectUnitypackageDialogOpen,
    selectUnitypackageDialogAssetId,
    unitypackages,
    dependencyDialogOpen,
    dependencyDialogAssetName,
    dependencyDialogDependencies,
  } = useAssetView({
    setShowingAssetCount,
  })

  return (
    <div className="h-[calc(100vh-72px)] flex flex-col">
      {sortedAssetSummary.length === 0 && (
        <AssetViewBackground
          type={background}
          openDialog={openAddAssetDialog}
        />
      )}
      <div className="flex-1 min-h-0" ref={layoutDivRef}>
        {displayStyle === 'Grid' && (
          <AssetGridView
            layoutDivRef={layoutDivRef}
            sortedAssetSummary={sortedAssetSummary}
            openSelectUnitypackageDialog={openSelectUnitypackageDialog}
            openDataManagementDialog={openDataManagementDialog}
            openEditAssetDialog={openEditAssetDialog}
            openDependencyDialog={openDependencyDialog}
          />
        )}
        {displayStyle === 'List' && (
          <AssetListView
            sortedAssetSummary={sortedAssetSummary}
            openSelectUnitypackageDialog={openSelectUnitypackageDialog}
            openDataManagementDialog={openDataManagementDialog}
            openEditAssetDialog={openEditAssetDialog}
            openDependencyDialog={openDependencyDialog}
          />
        )}
      </div>

      <MemoDialog />

      <SelectUnitypackageDialog
        dialogOpen={selectUnitypackageDialogOpen}
        setDialogOpen={setSelectUnitypackageDialogOpen}
        assetId={selectUnitypackageDialogAssetId}
        unitypackageFiles={unitypackages}
      />
      <DependencyDialog
        dialogOpen={dependencyDialogOpen}
        setDialogOpen={setDependencyDialogOpen}
        assetName={dependencyDialogAssetName}
        dependencyIds={dependencyDialogDependencies}
        openDependencyDialog={openDependencyDialog}
        openSelectUnitypackageDialog={openSelectUnitypackageDialog}
      />
    </div>
  )
}
