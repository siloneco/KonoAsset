import { useContext, useEffect, useRef, useState } from 'react'
import { AssetContext } from '@/components/context/AssetContext'
import { createFilterRequest, isFilterEnforced } from './logic'
import { PersistentContext } from '@/components/context/PersistentContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import AssetCard from '../AssetCard'
import { commands, FileInfo, FilterRequest } from '@/lib/bindings'

import SelectUnitypackageDialog from '../AssetCard/components/SelectUnitypackageDialog'
import AssetListBackground from './components/AssetListBackground'
import DataManagementDialog from '../AssetCard/components/MoreButton/components/DataManagementDialog'

type Props = {
  className?: string

  matchedAssetIDs: string[]
  setMatchedAssetIDs: (uuidList: string[]) => void
  filterEnforced: boolean
  setFilterEnforced: (filterEnforced: boolean) => void
  openAddAssetDialog: () => void
}

const AssetList = ({
  className,
  matchedAssetIDs,
  setMatchedAssetIDs,
  filterEnforced,
  setFilterEnforced,
  openAddAssetDialog,
}: Props) => {
  const [selectUnitypackageDialogOpen, setSelectUnitypackageDialogOpen] =
    useState(false)
  const [unitypackages, setUnityPackages] = useState<{
    [x: string]: FileInfo[]
  }>({})
  const [selectUnitypackageDialogAssetId, setSelectUnitypackageDialogAssetId] =
    useState<string | null>(null)

  const [dataManagementDialogOpen, setDataManagementDialogOpen] =
    useState(false)
  const [dataManagementDialogAssetId, setDataManagementDialogAssetId] =
    useState<string | null>(null)

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
    assetDisplaySortedList,
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
      {assetDisplaySortedList.length === 0 && (
        <AssetListBackground type="NoAssets" openDialog={openAddAssetDialog} />
      )}
      {assetDisplaySortedList.length > 0 && matchedAssetIDs.length === 0 && (
        <AssetListBackground type="NoResults" openDialog={openAddAssetDialog} />
      )}
      <div className="grid grid-cols-2 gap-4 m-6 mt-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 4xl:grid-cols-10 5xl:grid-cols-12">
        {assetDisplaySortedList &&
          !reverseOrder &&
          assetDisplaySortedList.map(
            (asset) =>
              (!filterEnforced || matchedAssetIDs.includes(asset.id)) && (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  ref={asset.id === editingAssetID ? scrollRef : undefined}
                  openSelectUnitypackageDialog={() =>
                    setSelectUnitypackageDialogOpen(true)
                  }
                  setUnitypackageFiles={setUnityPackages}
                  setDialogAssetId={setSelectUnitypackageDialogAssetId}
                  openDataManagementDialog={(assetId) => {
                    setDataManagementDialogAssetId(assetId)
                    setDataManagementDialogOpen(true)
                  }}
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
                    openSelectUnitypackageDialog={() =>
                      setSelectUnitypackageDialogOpen(true)
                    }
                    setUnitypackageFiles={setUnityPackages}
                    setDialogAssetId={setSelectUnitypackageDialogAssetId}
                    openDataManagementDialog={(assetId) => {
                      setDataManagementDialogAssetId(assetId)
                      setDataManagementDialogOpen(true)
                    }}
                  />
                ),
            )}
      </div>
      <SelectUnitypackageDialog
        dialogOpen={selectUnitypackageDialogOpen}
        setDialogOpen={setSelectUnitypackageDialogOpen}
        assetId={selectUnitypackageDialogAssetId}
        unitypackageFiles={unitypackages}
      />
      <DataManagementDialog
        assetId={dataManagementDialogAssetId}
        open={dataManagementDialogOpen}
        onOpenChange={setDataManagementDialogOpen}
      />
      <div className="w-full h-12" />
    </ScrollArea>
  )
}

export default AssetList
