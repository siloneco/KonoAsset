import AssetCard from '@/components/page/top/AssetCard'
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
    supportedAvatarFilter,
  } = useContext(AssetFilterContext)
  const { assetDisplaySortedList, reverseOrder } = useContext(AssetContext)
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

    const uuidList: string[] = await invoke('get_filtered_asset_ids', {
      request: filterRequest,
    })
    setMatchedAssetIDs(uuidList)
  }

  useEffect(() => {
    updateMatchedAssetIDs()
  }, [assetType, textFilter, categoryFilter, tagFilter, supportedAvatarFilter])

  return (
    <div className="grid grid-cols-2 gap-4 m-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {assetDisplaySortedList &&
        !reverseOrder &&
        assetDisplaySortedList.map(
          (asset) =>
            (!filterEnforced || matchedAssetIDs.includes(asset.id)) && (
              <AssetCard
                key={asset.id}
                id={asset.id}
                assetType={asset.asset_type}
                title={asset.title}
                author={asset.author}
                image_src={asset.image_src}
                booth_url={asset.booth_url ?? undefined}
              />
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
                <AssetCard
                  key={asset.id}
                  id={asset.id}
                  assetType={asset.asset_type}
                  title={asset.title}
                  author={asset.author}
                  image_src={asset.image_src}
                  booth_url={asset.booth_url ?? undefined}
                />
              ),
          )}
    </div>
  )
}

export default AssetList
