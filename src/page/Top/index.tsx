import { MainSidebar } from '@/components/model/MainSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { useTopPage } from './hook'
import { EditAssetDialog } from '@/components/model/asset-dialogs/EditAssetDialog'
import { useLocalization } from '@/hooks/use-localization'
import { DataManagementDialog } from '@/components/model/action-buttons/MoreButton/components/DataManagementDialog'
import { NavBar } from '@/components/model/MainNavBar'
import { AssetFilterContextProvider } from '@/components/functional/AssetFilterContext'
import { AssetViewContainer } from '@/components/container/AssetViewContainer'
import { AssetFormForAddContainer } from '@/components/container/AssetFormForAddContainer/AssetFormForAddContainer'
import { MemoDialog } from '@/components/model/MemoDialog'
import { DependencyDialog } from '@/components/model/DependencyDialog'
import { SelectUnitypackageDialog } from '@/components/model/SelectUnitypackageDialog'

export const TopPage = () => {
  const {
    isDragAndHover,

    onMainOpenButtonClick,
    openAddAssetDialog,
    openDirEditDialog,
    openEditAssetDialog,
    openMemoDialog,
    openDependencyDialog,

    addAssetDialogOpen,
    setAddAssetDialogOpen,

    editAssetDialogAssetId,
    editAssetDialogOpen,
    setEditAssetDialogOpen,

    dataManagementDialogAssetId,
    dataManagementDialogOpen,
    setDataManagementDialogOpen,

    memoDialogAssetId,
    memoDialogOpen,
    setMemoDialogOpen,

    dependencyDialogAssetId,
    dependencyDialogOpen,
    setDependencyDialogOpen,

    selectUnitypackageDialogAssetId,
    selectUnitypackageDialogOpen,
    setSelectUnitypackageDialogOpen,
    unitypackageFiles,

    resolveImageAbsolutePath,
  } = useTopPage()

  const { t } = useLocalization()

  return (
    <div className="flex selection:bg-primary selection:text-primary-foreground">
      <AssetFilterContextProvider>
        <SidebarProvider>
          <MainSidebar />
          <main className="w-full h-screen flex flex-col relative">
            <div>
              <NavBar />
            </div>
            <div className="h-screen flex flex-col grow overflow-hidden">
              <AssetViewContainer
                onMainOpenButtonClick={onMainOpenButtonClick}
                openAddAssetDialog={openAddAssetDialog}
                openDirEditDialog={openDirEditDialog}
                openEditAssetDialog={openEditAssetDialog}
                openMemoDialog={openMemoDialog}
                openDependencyDialog={openDependencyDialog}
              />
            </div>
            <div className="absolute size-16 right-8 bottom-8">
              <AssetFormForAddContainer
                dialogOpen={addAssetDialogOpen}
                setDialogOpen={setAddAssetDialogOpen}
                openEditAssetDialog={openEditAssetDialog}
                openDirEditDialog={openDirEditDialog}
              />
            </div>
            <EditAssetDialog
              id={editAssetDialogAssetId}
              dialogOpen={editAssetDialogOpen}
              setDialogOpen={setEditAssetDialogOpen}
            />
            <DataManagementDialog
              assetId={dataManagementDialogAssetId}
              open={dataManagementDialogOpen}
              onOpenChange={setDataManagementDialogOpen}
            />
            <MemoDialog
              assetId={memoDialogAssetId}
              dialogOpen={memoDialogOpen}
              setDialogOpen={setMemoDialogOpen}
            />
            <DependencyDialog
              assetId={dependencyDialogAssetId}
              dialogOpen={dependencyDialogOpen}
              setDialogOpen={setDependencyDialogOpen}
              resolveImageAbsolutePath={resolveImageAbsolutePath}
            />
            <SelectUnitypackageDialog
              assetId={selectUnitypackageDialogAssetId}
              dialogOpen={selectUnitypackageDialogOpen}
              setDialogOpen={setSelectUnitypackageDialogOpen}
              unitypackageFiles={unitypackageFiles}
            />
          </main>
        </SidebarProvider>
      </AssetFilterContextProvider>
      <div
        className={cn(
          'fixed h-full w-full opacity-0 z-60 pointer-events-none transition-opacity',
          isDragAndHover && 'opacity-100',
        )}
      >
        <div className="h-full w-full bg-black/80 flex items-center justify-center">
          <div className="bg-card p-12 rounded-3xl border-2 border-primary border-dashed">
            <p className="text-2xl">{t('top:add-text')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
