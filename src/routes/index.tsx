import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AssetDisplay, AssetType, MatchType, SortBy } from '@/lib/entity'
import {
  AssetFilterContext,
  AssetFilterContextType,
} from '@/components/context/AssetFilterContext'
import {
  AssetContext,
  AssetContextType,
} from '@/components/context/AssetContext'
import MainSidebar from '@/components/layout/MainSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { invoke } from '@tauri-apps/api/core'
import { cn } from '@/lib/utils'
import { getCurrentWindow } from '@tauri-apps/api/window'
import TopPageMainContent from '@/components/layout/TopPageMainContent'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [textFilter, setTextFilter] = useState('')
  const [assetType, setAssetType] = useState<AssetType | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [supportedAvatarFilter, setSupportedAvatarFilter] = useState<string[]>(
    [],
  )

  const [tagFilterMatchType, setTagFilterMatchType] = useState(MatchType.OR)
  const [supportedAvatarFilterMatchType, setSupportedAvatarFilterMatchType] =
    useState(MatchType.OR)

  const [sortBy, setSortBy] = useState<SortBy>(SortBy.CreatedAt)
  const [reverseOrder, setReverseOrder] = useState(true)
  const [assetDisplaySortedList, setAssetDisplaySortedList] = useState<
    AssetDisplay[]
  >([])

  const [isDragAndHover, setDragAndHover] = useState(false)

  const assetContextValue: AssetContextType = {
    sortBy: sortBy,
    setSortBy: setSortBy,
    reverseOrder: reverseOrder,
    setReverseOrder: setReverseOrder,

    assetDisplaySortedList: assetDisplaySortedList,
    setAssetDisplaySortedList: setAssetDisplaySortedList,

    deleteAssetById: async (id: string) => {
      setAssetDisplaySortedList((prev) =>
        prev.filter((asset) => asset.id !== id),
      )
    },

    refreshAssets: async () => {
      const assets: AssetDisplay[] = await invoke(
        'get_sorted_assets_for_display',
        {
          sortBy: sortBy,
        },
      )

      setAssetDisplaySortedList(assets)
    },
  }

  const filterContextValue: AssetFilterContextType = {
    textFilter: textFilter,
    setTextFilter: setTextFilter,

    assetType: assetType,
    setAssetType: setAssetType,

    categoryFilter,
    setCategoryFilter,

    tagFilter,
    setTagFilter,
    tagFilterMatchType,
    setTagFilterMatchType,

    supportedAvatarFilter,
    setSupportedAvatarFilter,
    supportedAvatarFilterMatchType,
    setSupportedAvatarFilterMatchType,
  }

  useEffect(() => {
    assetContextValue.refreshAssets()
  }, [sortBy])

  getCurrentWindow().onDragDropEvent((event) => {
    if (event.payload.type == 'enter' || event.payload.type == 'over') {
      setDragAndHover(true)
    } else {
      setDragAndHover(false)
    }
  })

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
