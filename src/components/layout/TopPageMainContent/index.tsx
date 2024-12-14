import AssetCard from '@/components/page/top/AssetCard'
import NavBar from '@/components/page/top/NavBar'
import { useContext, useEffect, useState } from 'react'
import { AssetFilterContext } from '../../context/AssetFilterContext'
import {
  AssetType,
  AvatarAsset,
  AvatarRelatedAssets,
  WorldRelatedAssets,
} from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'

const TopPageMainContent = () => {
  const [assets, setAssets] = useState<
    AvatarAsset[] | AvatarRelatedAssets[] | WorldRelatedAssets[]
  >([])

  const { assetType } = useContext(AssetFilterContext)

  const fetchAssets = async () => {
    if (assetType === undefined) {
      const avatarAssets = await invoke('get_avatar_assets')
      const avatarRelatedAssets = await invoke('get_avatar_related_assets')
      const worldAssets = await invoke('get_world_assets')

      const assets = [
        ...(avatarAssets as AvatarAsset[]),
        ...(avatarRelatedAssets as AvatarAsset[]),
        ...(worldAssets as AvatarAsset[]),
      ]

      setAssets(assets)
    } else if (assetType === AssetType.Avatar) {
      const result = await invoke('get_avatar_assets')
      setAssets(result as AvatarAsset[])
    } else if (assetType === AssetType.AvatarRelated) {
      const result = await invoke('get_avatar_related_assets')
      setAssets(result as AvatarRelatedAssets[])
    } else if (assetType === AssetType.World) {
      const result = await invoke('get_world_assets')
      setAssets(result as WorldRelatedAssets[])
    } else {
      console.error(`Invalid asset type: ${assetType}`)
      return
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [assetType])

  return (
    <main className="w-full">
      <NavBar />
      <div className="grid grid-cols-2 gap-4 m-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </main>
  )
}

export default TopPageMainContent
