import { FC } from 'react'
import { useAssetView } from './hook'
import { AssetViewBackground } from '../AssetViewBackground'
import { AssetGridView } from '../AssetGridView'
import { AssetListView } from '../AssetListView'
import { MemoDialog } from '@/components/models/memo-dialog/MemoDialog'
import { DependencyDialog } from '@/components/models/dependency-dialog/DependencyDialog'
import { UnitypackageSelectDialog } from '@/components/models/unitypackage-select-dialog/UnitypackageSelectDialog'

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
  const { layoutDivRef, sortedAssetSummary, displayStyle, background } =
    useAssetView({
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
            openDataManagementDialog={openDataManagementDialog}
            openEditAssetDialog={openEditAssetDialog}
          />
        )}
        {displayStyle === 'List' && (
          <AssetListView
            sortedAssetSummary={sortedAssetSummary}
            openDataManagementDialog={openDataManagementDialog}
            openEditAssetDialog={openEditAssetDialog}
          />
        )}
      </div>

      <MemoDialog />
      <UnitypackageSelectDialog />
      <DependencyDialog />
    </div>
  )
}
