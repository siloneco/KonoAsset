import MainSidebar from '@/components/layout/MainSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  AssetType,
  AvatarAsset,
  AvatarRelatedAssets,
  WorldRelatedAssets,
} from '@/lib/entity'
import {
  AssetFilterContext,
  AssetFilterContextType,
} from '@/components/context/AssetFilterContext'
import TopPageMainContent from '@/components/layout/TopPageMainContent'
import {
  AssetContext,
  AssetContextType,
} from '@/components/context/AssetContext'
import { invoke } from '@tauri-apps/api/core'

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

  const [avatarAssets, setAvatarAssets] = useState<AvatarAsset[]>([])
  const [avatarRelatedAssets, setAvatarRelatedAssets] = useState<
    AvatarRelatedAssets[]
  >([])
  const [worldAssets, setWorldAssets] = useState<WorldRelatedAssets[]>([])

  const assetContextValue: AssetContextType = {
    avatarAssets: avatarAssets,
    setAvatarAssets: setAvatarAssets,
    addAvatarAsset: (asset: AvatarAsset) => {
      setAvatarAssets([...avatarAssets, asset])
    },
    deleteAvatarAsset: (id: string) => {
      setAvatarAssets(avatarAssets.filter((asset) => asset.id !== id))
    },

    avatarRelatedAssets: avatarRelatedAssets,
    setAvatarRelatedAssets: setAvatarRelatedAssets,
    addAvatarRelatedAsset: (asset: AvatarRelatedAssets) => {
      setAvatarRelatedAssets([...avatarRelatedAssets, asset])
    },
    deleteAvatarRelatedAsset: (id: string) => {
      setAvatarRelatedAssets(
        avatarRelatedAssets.filter((asset) => asset.id !== id),
      )
    },

    worldAssets: worldAssets,
    setWorldAssets: setWorldAssets,
    addWorldAsset: (asset: WorldRelatedAssets) => {
      setWorldAssets([...worldAssets, asset])
    },
    deleteWorldAsset: (id: string) => {
      setWorldAssets(worldAssets.filter((asset) => asset.id !== id))
    },

    refreshAssets: async (assetType?: AssetType) => {
      if (assetType === undefined || assetType === AssetType.Avatar) {
        const result = await invoke('get_avatar_assets')
        setAvatarAssets(result as AvatarAsset[])
      }
      if (assetType === undefined || assetType === AssetType.AvatarRelated) {
        const result = await invoke('get_avatar_related_assets')
        setAvatarRelatedAssets(result as AvatarRelatedAssets[])
      }
      if (assetType === undefined || assetType === AssetType.World) {
        const result = await invoke('get_world_assets')
        setWorldAssets(result as WorldRelatedAssets[])
      }
    },
  }

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
      <AssetContext.Provider value={assetContextValue}>
        <AssetFilterContext.Provider value={filterContextValue}>
          <SidebarProvider>
            <MainSidebar />
            <TopPageMainContent />
          </SidebarProvider>
        </AssetFilterContext.Provider>
      </AssetContext.Provider>
    </div>
  )
}
