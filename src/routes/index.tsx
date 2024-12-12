import NavBar from '@/components/page/top/NavBar'
import AssetCard from '@/components/page/top/AssetCard'
import MainSidebar from '@/components/layout/MainSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { AvatarAsset } from '@/lib/entity'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [assets, setAssets] = useState<AvatarAsset[]>([])

  const updateAssets = async () => {
    const result = await invoke('get_avatar_assets')
    const avatars: AvatarAsset[] = result as AvatarAsset[]
    setAssets(avatars)

    console.log(avatars[0])
  }

  useEffect(() => {
    updateAssets()
  }, [])

  return (
    <div>
      <SidebarProvider>
        <MainSidebar />
        <main className="w-full">
          <NavBar />
          <div className="grid grid-cols-2 gap-4 m-6 md:grid-cols-3 lg:grid-cols-5">
            {assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} onDelete={() => {}} />
            ))}
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
