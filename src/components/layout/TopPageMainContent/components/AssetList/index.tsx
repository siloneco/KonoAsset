import AssetCard from '@/components/page/top/AssetCard'
import { useContext, useEffect, useState } from 'react'
import { AssetContext } from '@/components/context/AssetContext'
import { AssetFilterContext } from '@/components/context/AssetFilterContext'
import { AssetType } from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'

const isFilterEnforced = (textFilter: string) => {
  return textFilter !== ''
}

const AssetList = () => {
  const [matchedAssetIDs, setMatchedAssetIDs] = useState<string[]>([])

  const { assetType, textFilter } = useContext(AssetFilterContext)
  const { avatarAssets, avatarRelatedAssets, worldAssets, refreshAssets } =
    useContext(AssetContext)

  const updateMatchedAssetIDs = async () => {
    const uuidList: string[] = await invoke('filter_by_text', {
      text: textFilter,
    })
    setMatchedAssetIDs(uuidList)
  }

  useEffect(() => {
    updateMatchedAssetIDs()
  }, [textFilter])

  useEffect(() => {
    refreshAssets()
  }, [assetType])

  const filterEnforced = isFilterEnforced(textFilter)

  const displayAvatarAssets =
    assetType === undefined || assetType === AssetType.Avatar
  const displayAvatarRelatedAssets =
    assetType === undefined || assetType === AssetType.AvatarRelated
  const displayWorldAssets =
    assetType === undefined || assetType === AssetType.World

  return (
    <div className="grid grid-cols-2 gap-4 m-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {displayAvatarAssets &&
        avatarAssets.map(
          (asset) =>
            (!filterEnforced || matchedAssetIDs.includes(asset.id)) && (
              <AssetCard key={asset.id} asset={asset} />
            ),
        )}
      {displayAvatarRelatedAssets &&
        avatarRelatedAssets.map(
          (asset) =>
            (!filterEnforced || matchedAssetIDs.includes(asset.id)) && (
              <AssetCard key={asset.id} asset={asset} />
            ),
        )}
      {displayWorldAssets &&
        worldAssets.map(
          (asset) =>
            (!filterEnforced || matchedAssetIDs.includes(asset.id)) && (
              <AssetCard key={asset.id} asset={asset} />
            ),
        )}
    </div>
  )
}

export default AssetList
