import { AssetContext } from '@/components/context/AssetContext'
import MainSidebar from '@/components/model/MainSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { useTopPage } from './hook'
import NavBar from '../../model/MainNavBar'
import AddAssetDialog from '@/components/model/asset-dialogs/AddAssetDialog'
import EditAssetDialog from '@/components/model/asset-dialogs/EditAssetDialog'
import { useLocalization } from '@/hooks/use-localization'
import { UpdateDialog } from '@/components/model/UpdateDialog'
import { AssetList } from '@/components/model/asset-list/AssetList'

const TopPage = () => {
  const {
    assetContextValue,
    isDragAndHover,
    showingAssetCount,
    setShowingAssetCount,
    addAssetDialogOpen,
    setAddAssetDialogOpen,
    setEditAssetDialogAssetId,
    setEditAssetDialogOpen,
    editAssetDialogAssetId,
    editAssetDialogOpen,
    updateDialogOpen,
    setUpdateDialogOpen,
    updateDownloadTaskId,
  } = useTopPage()

  const { t } = useLocalization()

  return (
    <div className="flex">
      <AssetContext.Provider value={assetContextValue}>
        <SidebarProvider>
          <MainSidebar />
          <main className="w-full h-screen flex flex-col">
            <NavBar displayAssetCount={showingAssetCount} />
            <AssetList
              openAddAssetDialog={() => setAddAssetDialogOpen(true)}
              setShowingAssetCount={setShowingAssetCount}
            />
            <AddAssetDialog
              dialogOpen={addAssetDialogOpen}
              setDialogOpen={setAddAssetDialogOpen}
              openEditDialog={(assetId) => {
                setAddAssetDialogOpen(false)

                setEditAssetDialogAssetId(assetId)
                setEditAssetDialogOpen(true)
              }}
            />
            <EditAssetDialog
              id={editAssetDialogAssetId}
              dialogOpen={editAssetDialogOpen}
              setDialogOpen={setEditAssetDialogOpen}
            />
          </main>
        </SidebarProvider>
      </AssetContext.Provider>
      <UpdateDialog
        dialogOpen={updateDialogOpen}
        setDialogOpen={setUpdateDialogOpen}
        taskId={updateDownloadTaskId}
      />
      <div
        className={cn(
          'fixed h-full w-full opacity-0 z-[60] pointer-events-none transition-opacity',
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

export default TopPage
