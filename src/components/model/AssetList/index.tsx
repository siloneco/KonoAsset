import { useContext, useEffect, useRef } from 'react'
import { AssetContext } from '@/components/context/AssetContext'
import { createFilterRequest, isFilterEnforced } from './logic'
import { PersistentContext } from '@/components/context/PersistentContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import AssetCard from './components/AssetCard'
import { commands, FilterRequest } from '@/lib/bindings'

type Props = {
  className?: string

  matchedAssetIDs: string[]
  setMatchedAssetIDs: (uuidList: string[]) => void
  filterEnforced: boolean
  setFilterEnforced: (filterEnforced: boolean) => void
}

const AssetList = ({
  className,
  matchedAssetIDs,
  setMatchedAssetIDs,
  filterEnforced,
  setFilterEnforced,
}: Props) => {
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
      text: textFilter,
      categories: categoryFilter,
      tags: tagFilter,
      tagMatchType: tagFilterMatchType,
      supportedAvatars: supportedAvatarFilter,
      supportedAvatarMatchType: supportedAvatarFilterMatchType,
    })

    const currentFilterEnforced = isFilterEnforced(filterRequest)
    setFilterEnforced(currentFilterEnforced)

    if (!currentFilterEnforced) {
      return
    }

    const result = await commands.getFilteredAssetIds(filterRequest)

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    setMatchedAssetIDs(result.data)
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
