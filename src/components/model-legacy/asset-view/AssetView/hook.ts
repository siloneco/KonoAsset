import { AssetContext } from '@/components/context/AssetContext'
import { PersistentContext } from '@/components/context/PersistentContext'
import { AssetSummary, commands, FileInfo, FilterRequest } from '@/lib/bindings'
import {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  calculateColumnCount,
  createFilterRequest,
  isFilterEnforced,
} from './logic'
import { useGetElementProperty } from '@/hooks/use-get-element-property'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'
import { useShallow } from 'zustand/react/shallow'

type Props = {
  setShowingAssetCount: (count: number) => void
}

type ReturnProps = {
  sortedAssetSummary: AssetSummary[]
  layoutDivRef: RefObject<HTMLDivElement | null>
  gridColumnCount: number
  displayStyle: 'Grid' | 'List'
  background: 'NoAssets' | 'NoResults'

  openSelectUnitypackageDialog: (
    assetId: string,
    data: { [x: string]: FileInfo[] },
  ) => void
  openMemoDialog: (assetId: string) => void
  openDependencyDialog: (assetName: string, dependencyIds: string[]) => void

  setSelectUnitypackageDialogOpen: (open: boolean) => void
  setMemoDialogOpen: (open: boolean) => void
  setDependencyDialogOpen: (open: boolean) => void

  selectUnitypackageDialogOpen: boolean
  selectUnitypackageDialogAssetId: string | null
  unitypackages: { [x: string]: FileInfo[] }
  memoDialogAssetId: string | null
  memoDialogOpen: boolean
  dependencyDialogOpen: boolean
  dependencyDialogAssetName: string | null
  dependencyDialogDependencies: string[]
}

export const useAssetView = ({ setShowingAssetCount }: Props): ReturnProps => {
  const [selectUnitypackageDialogOpen, setSelectUnitypackageDialogOpen] =
    useState(false)
  const [unitypackages, setUnityPackages] = useState<{
    [x: string]: FileInfo[]
  }>({})
  const [selectUnitypackageDialogAssetId, setSelectUnitypackageDialogAssetId] =
    useState<string | null>(null)

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
  const { setFilteredIds } = useContext(AssetContext)

  const {
    sortedAssetSummaries,
    reverseOrder,
    assetViewStyle,
    refreshAssetSummaries,
  } = useAssetSummaryViewStore(
    useShallow((state) => {
      return {
        sortedAssetSummaries: state.sortedAssetSummaries,
        reverseOrder: state.reverseOrder,
        assetViewStyle: state.assetViewStyle,
        refreshAssetSummaries: state.refreshAssetSummaries,
      }
    }),
  )

  useEffect(() => {
    refreshAssetSummaries()
  }, [refreshAssetSummaries])

  const updateSortedAssetSummary = useCallback(async () => {
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
        reverseOrder ? sortedAssetSummaries.reverse() : sortedAssetSummaries,
      )

      setFilteredIds(null)
      setShowingAssetCount(sortedAssetSummaries.length)
      return
    }

    const result = await commands.getFilteredAssetIds(filterRequest)

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    const assetIds = result.data

    const sortedAssets = sortedAssetSummaries.filter((asset) =>
      assetIds.includes(asset.id),
    )

    setSortedAssetSummary(reverseOrder ? sortedAssets.reverse() : sortedAssets)
    setFilteredIds(assetIds)
    setShowingAssetCount(sortedAssets.length)
  }, [
    sortedAssetSummaries,
    assetType,
    categoryFilter,
    generalQueryTextFilter,
    queryTextFilterForCreator,
    queryTextFilterForName,
    queryTextMode,
    reverseOrder,
    setFilteredIds,
    setShowingAssetCount,
    supportedAvatarFilter,
    supportedAvatarFilterMatchType,
    tagFilter,
    tagFilterMatchType,
  ])

  useEffect(() => {
    updateSortedAssetSummary()
  }, [updateSortedAssetSummary])

  const layoutDivRef = useRef<HTMLDivElement>(null)
  const [gridColumnCount, setGridColumnCount] = useState(1)

  const { getElementProperty } = useGetElementProperty(layoutDivRef)

  const updateColumns = useCallback(() => {
    setGridColumnCount(
      assetViewStyle !== 'List'
        ? calculateColumnCount(getElementProperty('width'), assetViewStyle)
        : 1,
    )
  }, [assetViewStyle, getElementProperty])

  useEffect(() => {
    updateColumns()

    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [assetViewStyle, updateColumns])

  const openSelectUnitypackageDialog = (
    assetId: string,
    data: { [x: string]: FileInfo[] },
  ) => {
    setUnityPackages(data)
    setSelectUnitypackageDialogAssetId(assetId)
    setSelectUnitypackageDialogOpen(true)
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
    displayStyle: assetViewStyle === 'List' ? 'List' : 'Grid',
    background: sortedAssetSummaries.length === 0 ? 'NoAssets' : 'NoResults',

    openSelectUnitypackageDialog,
    openMemoDialog,
    openDependencyDialog,

    setSelectUnitypackageDialogOpen,
    setMemoDialogOpen,
    setDependencyDialogOpen,

    selectUnitypackageDialogOpen,
    selectUnitypackageDialogAssetId,
    unitypackages,
    memoDialogAssetId,
    memoDialogOpen,
    dependencyDialogOpen,
    dependencyDialogAssetName,
    dependencyDialogDependencies,
  }
}
