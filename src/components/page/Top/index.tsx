import { AssetFilterContext } from '@/components/context/AssetFilterContext'
import { AssetContext } from '@/components/context/AssetContext'
import MainSidebar from '@/components/layout/MainSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import TopPageMainContent from '@/components/layout/TopPageMainContent'
import { useTopPage } from './hook'

const TopPage = () => {
  const { assetContextValue, filterContextValue, isDragAndHover } = useTopPage()

  return (
    <div className="flex">
      <AssetContext.Provider value={assetContextValue}>
        <AssetFilterContext.Provider value={filterContextValue}>
          <SidebarProvider>
            <MainSidebar />
            <TopPageMainContent />
          </SidebarProvider>
        </AssetFilterContext.Provider>
      </AssetContext.Provider>
      <div
        className={cn(
          'fixed h-full w-full opacity-0 z-[60] pointer-events-none transition-opacity',
          isDragAndHover && 'opacity-100',
        )}
      >
        <div className="h-full w-full bg-black/80 flex items-center justify-center">
          <div className="bg-card p-12 rounded-3xl border-2 border-primary border-dashed">
            <p className="text-2xl">ファイルをドロップしてアセットを追加</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopPage
