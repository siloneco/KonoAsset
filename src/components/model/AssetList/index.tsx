import AssetCard from '@/components/model/AssetList/components/AssetCard'
import { useContext, useEffect, useState } from 'react'
import { AssetContext } from '@/components/context/AssetContext'
import { AssetFilterContext } from '@/components/context/AssetFilterContext'
import { FilterRequest } from '@/lib/entity'
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
    tagFilterMatchType,
    supportedAvatarFilter,
    supportedAvatarFilterMatchType,
    setCategoryFilter,
    setSupportedAvatarFilter,
  } = useContext(AssetFilterContext)
  const { assetDisplaySortedList, reverseOrder } = useContext(AssetContext)
  const clearCategories = () => setCategoryFilter([])

  const updateMatchedAssetIDs = async () => {
    const filterRequest: FilterRequest = createFilterRequest({
      assetType: assetType,
      query: textFilter,
      categories: categoryFilter,
      tags: tagFilter,
      tagMatchType: tagFilterMatchType,
      supported_avatars: supportedAvatarFilter,
      supportedAvatarMatchType: supportedAvatarFilterMatchType,
      clearCategories,
      clearSupportedAvatars: () => setSupportedAvatarFilter([]),
    })

    const currentFilterEnforced = isFilterEnforced(filterRequest)
    setFilterEnforced(currentFilterEnforced)

    if (!currentFilterEnforced) {
      return
    }

    const uuidList: string[] = await invoke('get_filtered_asset_ids', {
      request: filterRequest,
    })
    setMatchedAssetIDs(uuidList)
  }

  useEffect(() => {
    updateMatchedAssetIDs()
  }, [
    assetType,
    textFilter,
    categoryFilter,
    tagFilter,
    supportedAvatarFilter,
    tagFilterMatchType,
    supportedAvatarFilterMatchType,
  ])

  useEffect(() => {
    clearCategories()
  }, [assetType])

  return (
    <div className="grid grid-cols-2 gap-4 m-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {assetDisplaySortedList &&
        !reverseOrder &&
        assetDisplaySortedList.map(
          (asset) =>
            (!filterEnforced || matchedAssetIDs.includes(asset.id)) && (
              <AssetCard key={asset.id} asset={asset} />
            ),
        )}
      {assetDisplaySortedList &&
        reverseOrder &&
        assetDisplaySortedList
          .slice(0)
          .reverse()
          .map(
            (asset) =>
              (!filterEnforced || matchedAssetIDs.includes(asset.id)) && (
                <AssetCard key={asset.id} asset={asset} />
              ),
          )}
    </div>
  )
}

export default AssetList
