import { AssetContext } from '@/components/context/AssetContext'
import MainSidebar from '@/components/model/MainSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { useTopPage } from './hook'
import { useState } from 'react'
import NavBar from '../../model/MainNavBar'
import AssetList from '@/components/model/AssetList'
import AddAssetDialog from '@/components/model/asset-dialogs/AddAssetDialog'
import EditAssetDialog from '@/components/model/asset-dialogs/EditAssetDialog'
import { useLocalization } from '@/hooks/use-localization'

const TopPage = () => {
  const { assetContextValue, isDragAndHover } = useTopPage()

  const [filterEnforced, setFilterEnforced] = useState(false)
  const [matchedAssetIDs, setMatchedAssetIDs] = useState<string[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const [editAssetDialogOpen, setEditAssetDialogOpen] = useState(false)
  const [editAssetDialogAssetId, setEditAssetDialogAssetId] = useState<
    string | null
  >(null)

  const displayAssetCount: number | undefined = filterEnforced
    ? matchedAssetIDs.length
    : undefined

  const { t } = useLocalization()

  return (
    <div className="flex">
      <AssetContext.Provider value={assetContextValue}>
        <SidebarProvider>
          <MainSidebar />
          <main className="w-full h-screen flex flex-col">
            <NavBar displayAssetCount={displayAssetCount} />
            <AssetList
              className="flex-grow"
              matchedAssetIDs={matchedAssetIDs}
              setMatchedAssetIDs={setMatchedAssetIDs}
              filterEnforced={filterEnforced}
              setFilterEnforced={setFilterEnforced}
              openAddAssetDialog={() => setDialogOpen(true)}
            />
            <AddAssetDialog
              dialogOpen={dialogOpen}
              setDialogOpen={setDialogOpen}
              openEditDialog={(assetId) => {
                setDialogOpen(false)

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
