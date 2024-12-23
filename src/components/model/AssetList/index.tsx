import { useContext, useEffect, useRef, useState } from 'react'
import { AssetContext } from '@/components/context/AssetContext'
import { FilterRequest } from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'
import { createFilterRequest, isFilterEnforced } from './logic'
import { PersistentContext } from '@/components/context/PersistentContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import AssetCard from './components/AssetCard'

type Props = {
  className?: string
}

const AssetList = ({ className }: Props) => {
  const [matchedAssetIDs, setMatchedAssetIDs] = useState<string[]>([])
  const [filterEnforced, setFilterEnforced] = useState(false)
  const { editingAssetID, setEditingAssetID } = useContext(PersistentContext)

  const {
    reverseOrder,
    assetType,
    textFilter,
    categoryFilter,
    tagFilter,
    tagFilterMatchType,
    supportedAvatarFilter,
    supportedAvatarFilterMatchType,
  } = useContext(PersistentContext)
  const { assetDisplaySortedList } = useContext(AssetContext)

  const updateMatchedAssetIDs = async () => {
    const filterRequest: FilterRequest = createFilterRequest({
      assetType: assetType,
      query: textFilter,
      categories: categoryFilter,
      tags: tagFilter,
      tagMatchType: tagFilterMatchType,
      supported_avatars: supportedAvatarFilter,
      supportedAvatarMatchType: supportedAvatarFilterMatchType,
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

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current !== null) {
      scrollRef.current.scrollIntoView({
        behavior: 'instant',
        block: 'center',
      })

      setEditingAssetID(null)
    }
  }, [assetDisplaySortedList])

  return (
    <ScrollArea className={className}>
      <div className="grid grid-cols-2 gap-4 m-6 mt-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {assetDisplaySortedList &&
          !reverseOrder &&
          assetDisplaySortedList.map(
            (asset) =>
              (!filterEnforced || matchedAssetIDs.includes(asset.id)) && (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  ref={asset.id === editingAssetID ? scrollRef : undefined}
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
                    asset={asset}
                    ref={asset.id === editingAssetID ? scrollRef : undefined}
                  />
                ),
            )}
      </div>
      <div className="w-full h-12" />
    </ScrollArea>
  )
}

export default AssetList
