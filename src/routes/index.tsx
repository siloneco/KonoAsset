import NavBar from '@/components/page/top/NavBar'
import AssetListItem from '@/components/page/top/AssetListItem'
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
    <main className="w-full">
      <NavBar />
      <div className="grid grid-cols-2 gap-4 m-6 md:grid-cols-3 lg:grid-cols-5">
        {assets.map((asset) => (
          <AssetListItem key={asset.id} asset={asset} onDelete={() => {}} />
        ))}
      </div>
    </main>
  )
}
