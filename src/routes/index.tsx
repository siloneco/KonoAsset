import MainSidebar from '@/components/layout/MainSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AssetType } from '@/lib/entity'
import {
  AssetFilterContext,
  AssetFilterContextType,
} from '@/components/layout/AssetFilterContext'
import TopPageMainContent from '@/components/layout/TopPageMainContent'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [textFilter, setTextFilter] = useState('')
  const [assetType, setAssetType] = useState<AssetType | undefined>(undefined)
  const [supportedAvatarFilter, setSupportedAvatarFilter] = useState<string[]>(
    [],
  )
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>([])

  const filterContextValue: AssetFilterContextType = {
    textFilter: textFilter,
    setTextFilter: setTextFilter,

    assetType: assetType,
    setAssetType: setAssetType,

    supportedAvatarFilter,
    setSupportedAvatarFilter,

    categoryFilter,
    setCategoryFilter,

    tagFilter,
    setTagFilter,
  }

  return (
    <div>
      <AssetFilterContext.Provider value={filterContextValue}>
        <SidebarProvider>
          <MainSidebar />
          <TopPageMainContent />
        </SidebarProvider>
      </AssetFilterContext.Provider>
    </div>
  )
}
