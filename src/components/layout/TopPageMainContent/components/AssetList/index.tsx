import AssetCard from '@/components/page/top/AssetCard'
import { useContext, useEffect } from 'react'
import { AssetContext } from '@/components/context/AssetContext'
import { AssetFilterContext } from '@/components/context/AssetFilterContext'
import { AssetType } from '@/lib/entity'

const AssetList = () => {
  const { assetType } = useContext(AssetFilterContext)
  const { avatarAssets, avatarRelatedAssets, worldAssets, refreshAssets } =
    useContext(AssetContext)

  useEffect(() => {
    refreshAssets()
  }, [assetType])

  const displayAvatarAssets =
    assetType === undefined || assetType === AssetType.Avatar
  const displayAvatarRelatedAssets =
    assetType === undefined || assetType === AssetType.AvatarRelated
  const displayWorldAssets =
    assetType === undefined || assetType === AssetType.World

  return (
    <div className="grid grid-cols-2 gap-4 m-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {displayAvatarAssets &&
        avatarAssets.map((asset) => <AssetCard key={asset.id} asset={asset} />)}
      {displayAvatarRelatedAssets &&
        avatarRelatedAssets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      {displayWorldAssets &&
        worldAssets.map((asset) => <AssetCard key={asset.id} asset={asset} />)}
    </div>
  )
}

export default AssetList
