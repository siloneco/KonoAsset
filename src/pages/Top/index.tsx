import { MainSidebar } from '@/components/model-legacy/MainSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { useTopPage } from './hook'
import { AddAssetDialog } from '@/components/model-legacy/asset-dialogs/AddAssetDialog'
import { EditAssetDialog } from '@/components/model-legacy/asset-dialogs/EditAssetDialog'
import { useLocalization } from '@/hooks/use-localization'
import { DataManagementDialog } from '@/components/model-legacy/DataManagementDialog'
import { useCallback } from 'react'
import { AssetView } from '@/components/model-legacy/asset-view/AssetView'
import { StatusBar } from '@/components/models/status-bar/StatusBar'

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
    <div className="flex selection:bg-primary selection:text-primary-foreground [view-transition-name:main-content]">
      <SidebarProvider>
        <MainSidebar />
        <main className="w-full h-screen flex flex-col">
          <StatusBar filterAppliedAssetCount={showingAssetCount} />
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
