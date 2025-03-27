import { AssetContext } from '@/components/context/AssetContext'
import { PersistentContext } from '@/components/context/PersistentContext'
import { AssetSummary, commands, FileInfo, FilterRequest } from '@/lib/bindings'
import { RefObject, useContext, useEffect, useRef, useState } from 'react'
import {
  calculateColumnCount,
  createFilterRequest,
  isFilterEnforced,
} from './logic'
import { useGetElementProperty } from '@/hooks/use-get-element-property'

type Props = {
  setShowingAssetCount: (count: number) => void
}

type ReturnProps = {
  sortedAssetSummary: AssetSummary[]
  layoutDivRef: RefObject<HTMLDivElement | null>
  gridColumnCount: number
  background: 'NoAssets' | 'NoResults'

  openSelectUnitypackageDialog: (
    assetId: string,
    data: { [x: string]: FileInfo[] },
  ) => void
  openDataManagementDialog: (assetId: string) => void
  openEditAssetDialog: (assetId: string) => void
  openMemoDialog: (assetId: string) => void
  openDependencyDialog: (assetName: string, dependencyIds: string[]) => void

  setSelectUnitypackageDialogOpen: (open: boolean) => void
  setDataManagementDialogOpen: (open: boolean) => void
  setEditAssetDialogOpen: (open: boolean) => void
  setMemoDialogOpen: (open: boolean) => void
  setDependencyDialogOpen: (open: boolean) => void

  selectUnitypackageDialogOpen: boolean
  selectUnitypackageDialogAssetId: string | null
  unitypackages: { [x: string]: FileInfo[] }
  dataManagementDialogAssetId: string | null
  dataManagementDialogOpen: boolean
  editAssetDialogAssetId: string | null
  editAssetDialogOpen: boolean
  memoDialogAssetId: string | null
  memoDialogOpen: boolean
  dependencyDialogOpen: boolean
  dependencyDialogAssetName: string | null
  dependencyDialogDependencies: string[]
}

export const useAssetList = ({ setShowingAssetCount }: Props): ReturnProps => {
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

  const [dependencyDialogOpen, setDependencyDialogOpen] = useState(false)
  const [dependencyDialogAssetName, setDependencyDialogAssetName] = useState<
    string | null
  >(null)
  const [dependencyDialogDependencies, setDependencyDialogDependencies] =
    useState<string[]>([])

  const [sortedAssetSummary, setSortedAssetSummary] = useState<AssetSummary[]>(
    [],
  )

  const {
    reverseOrder,
    assetCardSize,
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

  const updateSortedAssetSummary = async () => {
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

    if (!currentFilterEnforced) {
      setSortedAssetSummary(
        reverseOrder
          ? assetDisplaySortedList.reverse()
          : assetDisplaySortedList,
      )

      setShowingAssetCount(assetDisplaySortedList.length)
      return
    }

    const result = await commands.getFilteredAssetIds(filterRequest)

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    const assetIds = result.data

    const sortedAssets = assetDisplaySortedList.filter((asset) =>
      assetIds.includes(asset.id),
    )

    setSortedAssetSummary(reverseOrder ? sortedAssets.reverse() : sortedAssets)
    setShowingAssetCount(sortedAssets.length)
  }

  useEffect(() => {
    updateSortedAssetSummary()
  }, [
    reverseOrder,
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

  const layoutDivRef = useRef<HTMLDivElement>(null)
  const [gridColumnCount, setGridColumnCount] = useState(1)

  const { getElementProperty } = useGetElementProperty(layoutDivRef)

  const updateColumns = () => {
    setGridColumnCount(
      assetCardSize !== 'List'
        ? calculateColumnCount(getElementProperty('width'), assetCardSize)
        : 1,
    )
  }

  useEffect(() => {
    updateColumns()

    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [assetCardSize])

  const openSelectUnitypackageDialog = (
    assetId: string,
    data: { [x: string]: FileInfo[] },
  ) => {
    setUnityPackages(data)
    setSelectUnitypackageDialogAssetId(assetId)
    setSelectUnitypackageDialogOpen(true)
  }

  const openDataManagementDialog = (assetId: string) => {
    setDataManagementDialogAssetId(assetId)
    setDataManagementDialogOpen(true)
  }

  const openEditAssetDialog = (assetId: string) => {
    setEditAssetDialogAssetId(assetId)
    setEditAssetDialogOpen(true)
  }

  const openMemoDialog = (assetId: string) => {
    setMemoDialogAssetId(assetId)
    setMemoDialogOpen(true)
  }

  const openDependencyDialog = (assetName: string, dependencyIds: string[]) => {
    setDependencyDialogAssetName(assetName)
    setDependencyDialogDependencies(dependencyIds)
    setDependencyDialogOpen(true)
  }

  return {
    sortedAssetSummary,
    layoutDivRef,
    gridColumnCount,
    background: assetDisplaySortedList.length === 0 ? 'NoAssets' : 'NoResults',

    openSelectUnitypackageDialog,
    openDataManagementDialog,
    openEditAssetDialog,
    openMemoDialog,
    openDependencyDialog,

    setSelectUnitypackageDialogOpen,
    setDataManagementDialogOpen,
    setEditAssetDialogOpen,
    setMemoDialogOpen,
    setDependencyDialogOpen,

    selectUnitypackageDialogOpen,
    selectUnitypackageDialogAssetId,
    unitypackages,
    dataManagementDialogAssetId,
    dataManagementDialogOpen,
    editAssetDialogAssetId,
    editAssetDialogOpen,
    memoDialogAssetId,
    memoDialogOpen,
    dependencyDialogOpen,
    dependencyDialogAssetName,
    dependencyDialogDependencies,
  }
}
