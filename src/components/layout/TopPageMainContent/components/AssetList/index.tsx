import AssetCard from '@/components/page/top/AssetCard'
import { useContext, useEffect, useState } from 'react'
import { AssetContext } from '@/components/context/AssetContext'
import { AssetFilterContext } from '@/components/context/AssetFilterContext'
import { AssetType, FilterRequest } from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'
import { createFilterRequest, isFilterEnforced } from './logic'

const AssetList = () => {
  const [matchedAssetIDs, setMatchedAssetIDs] = useState<string[]>([])
  const [filterEnforced, setFilterEnforced] = useState(false)

  const {
    assetType,
    textFilter,
    categoryFilter,
    tagFilter,
    supportedAvatarFilter,
  } = useContext(AssetFilterContext)
  const { avatarAssets, avatarRelatedAssets, worldAssets, refreshAssets } =
    useContext(AssetContext)

  const updateMatchedAssetIDs = async () => {
    const filterRequest: FilterRequest = createFilterRequest({
      assetType: assetType,
      query: textFilter,
      categories: categoryFilter,
      tags: tagFilter,
      supported_avatars: supportedAvatarFilter,
    })

    const currentFilterEnforced = isFilterEnforced(filterRequest)
    setFilterEnforced(currentFilterEnforced)

    if (!currentFilterEnforced) {
      return
    }

    console.log(filterRequest)

    const uuidList: string[] = await invoke('get_filtered_asset_ids', {
      request: filterRequest,
    })
    setMatchedAssetIDs(uuidList)
  }

  useEffect(() => {
    updateMatchedAssetIDs()
  }, [textFilter, categoryFilter, tagFilter, supportedAvatarFilter])

  useEffect(() => {
    refreshAssets()
  }, [assetType])

  const displayAvatarAssets =
    (assetType as string) === '' || assetType === AssetType.Avatar
  const displayAvatarRelatedAssets =
    (assetType as string) === '' || assetType === AssetType.AvatarRelated
  const displayWorldAssets =
    (assetType as string) === '' || assetType === AssetType.World

  return (
    <div className="grid grid-cols-2 gap-4 m-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {displayAvatarAssets &&
        avatarAssets.map(
          (asset) =>
            (!filterEnforced || matchedAssetIDs.includes(asset.id)) && (
              <AssetCard
                key={asset.id}
                id={asset.id}
                assetType={AssetType.Avatar}
                assetDescription={asset.description}
              />
            ),
        )}
      {displayAvatarRelatedAssets &&
        avatarRelatedAssets.map(
          (asset) =>
            (!filterEnforced || matchedAssetIDs.includes(asset.id)) && (
              <AssetCard
                key={asset.id}
                id={asset.id}
                assetType={AssetType.AvatarRelated}
                assetDescription={asset.description}
              />
            ),
        )}
      {displayWorldAssets &&
        worldAssets.map(
          (asset) =>
            (!filterEnforced || matchedAssetIDs.includes(asset.id)) && (
              <AssetCard
                key={asset.id}
                id={asset.id}
                assetType={AssetType.World}
                assetDescription={asset.description}
              />
            ),
        )}
    </div>
  )
}

export default AssetList
