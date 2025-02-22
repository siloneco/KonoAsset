import { useContext, useEffect, useState } from 'react'
import { AssetContext } from '@/components/context/AssetContext'
import { createFilterRequest, isFilterEnforced } from './logic'
import { PersistentContext } from '@/components/context/PersistentContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import AssetCard from '../AssetCard'
import { commands, FileInfo, FilterRequest } from '@/lib/bindings'

import SelectUnitypackageDialog from '../AssetCard/components/SelectUnitypackageDialog'
import AssetListBackground from './components/AssetListBackground'
import DataManagementDialog from '../AssetCard/components/MoreButton/components/DataManagementDialog'
import EditAssetDialog from '../asset-dialogs/EditAssetDialog'
import MemoDialog from '../MemoDialog'

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

  const [editAssetDialogOpen, setEditAssetDialogOpen] = useState(false)
  const [editAssetDialogAssetId, setEditAssetDialogAssetId] = useState<
    string | null
  >(null)

  const [memoDialogOpen, setMemoDialogOpen] = useState(false)
  const [memoDialogAssetId, setMemoDialogAssetId] = useState<string | null>(
    null,
  )

  const {
    reverseOrder,
    assetType,
    queryTextMode,
    generalQueryTextFilter,
    queryTextFilterForName,
    queryTextFilterForCreator,
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
      queryTextMode: queryTextMode,
      generalQueryText: generalQueryTextFilter,
      queryTextFilterForName: queryTextFilterForName,
      queryTextFilterForCreator: queryTextFilterForCreator,
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
    queryTextMode,
    generalQueryTextFilter,
    queryTextFilterForName,
    queryTextFilterForCreator,
    categoryFilter,
    tagFilter,
    tagFilterMatchType,
    supportedAvatarFilter,
    supportedAvatarFilterMatchType,
  ])

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
                  openSelectUnitypackageDialog={() =>
                    setSelectUnitypackageDialogOpen(true)
                  }
                  setUnitypackageFiles={setUnityPackages}
                  setDialogAssetId={setSelectUnitypackageDialogAssetId}
                  openDataManagementDialog={(assetId) => {
                    setDataManagementDialogAssetId(assetId)
                    setDataManagementDialogOpen(true)
                  }}
                  openEditAssetDialog={(assetId) => {
                    setEditAssetDialogAssetId(assetId)
                    setEditAssetDialogOpen(true)
                  }}
                  openMemoDialog={(assetId) => {
                    setMemoDialogAssetId(assetId)
                    setMemoDialogOpen(true)
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
                    openSelectUnitypackageDialog={() =>
                      setSelectUnitypackageDialogOpen(true)
                    }
                    setUnitypackageFiles={setUnityPackages}
                    setDialogAssetId={setSelectUnitypackageDialogAssetId}
                    openDataManagementDialog={(assetId) => {
                      setDataManagementDialogAssetId(assetId)
                      setDataManagementDialogOpen(true)
                    }}
                    openEditAssetDialog={(assetId) => {
                      setEditAssetDialogAssetId(assetId)
                      setEditAssetDialogOpen(true)
                    }}
                    openMemoDialog={(assetId) => {
                      setMemoDialogAssetId(assetId)
                      setMemoDialogOpen(true)
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
      <EditAssetDialog
        id={editAssetDialogAssetId}
        dialogOpen={editAssetDialogOpen}
        setDialogOpen={setEditAssetDialogOpen}
      />
      <MemoDialog
        assetId={memoDialogAssetId}
        dialogOpen={memoDialogOpen}
        setDialogOpen={setMemoDialogOpen}
      />
      <div className="w-full h-12" />
    </ScrollArea>
  )
}

export default AssetList
