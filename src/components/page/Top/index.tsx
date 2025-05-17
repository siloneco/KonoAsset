import { MainSidebar } from '@/components/model/MainSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { useTopPage } from './hook'
import { NavBar } from '../../model/MainNavBar'
import { AddAssetDialog } from '@/components/model/asset-dialogs/AddAssetDialog'
import { EditAssetDialog } from '@/components/model/asset-dialogs/EditAssetDialog'
import { useLocalization } from '@/hooks/use-localization'
import { AssetView } from '@/components/model/asset-view/AssetView'
import { DataManagementDialog } from '@/components/model/action-buttons/MoreButton/components/DataManagementDialog'
import { AssetContextProvider } from '@/components/context/AssetContext'
import { useCallback } from 'react'

export const TopPage = () => {
  const {
    isDragAndHover,
    showingAssetCount,
    setShowingAssetCount,
    addAssetDialogOpen,
    setAddAssetDialogOpen,
    setEditAssetDialogAssetId,
    setEditAssetDialogOpen,
    editAssetDialogAssetId,
    editAssetDialogOpen,
    dataManagementDialogAssetId,
    dataManagementDialogOpen,
    setDataManagementDialogOpen,
    openDataManagementDialog,
  } = useTopPage()

  const { t } = useLocalization()

  const openEditAssetDialog = useCallback(
    (assetId: string) => {
      setAddAssetDialogOpen(false)

      setEditAssetDialogAssetId(assetId)
      setEditAssetDialogOpen(true)
    },
    [setAddAssetDialogOpen, setEditAssetDialogAssetId, setEditAssetDialogOpen],
  )

  return (
    <div className="flex selection:bg-primary selection:text-primary-foreground">
      <AssetContextProvider>
        <SidebarProvider>
          <MainSidebar />
          <main className="w-full h-screen flex flex-col">
            <NavBar displayAssetCount={showingAssetCount} />
            <AssetView
              openAddAssetDialog={() => setAddAssetDialogOpen(true)}
              openEditAssetDialog={openEditAssetDialog}
              openDataManagementDialog={openDataManagementDialog}
              setShowingAssetCount={setShowingAssetCount}
            />
            <AddAssetDialog
              dialogOpen={addAssetDialogOpen}
              setDialogOpen={setAddAssetDialogOpen}
              openEditDialog={openEditAssetDialog}
              openDataManagementDialog={(id) => {
                setAddAssetDialogOpen(false)
                openDataManagementDialog(id)
              }}
            />
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
          </main>
        </SidebarProvider>
      </AssetContextProvider>
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
