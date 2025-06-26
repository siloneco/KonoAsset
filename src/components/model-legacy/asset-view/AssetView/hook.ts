import { AssetSummary, FileInfo } from '@/lib/bindings'
import { useEffect, useMemo, useState } from 'react'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'
import { useShallow } from 'zustand/react/shallow'
import { useAssetFilterStore } from '@/stores/AssetFilterStore'

type Props = {
  setShowingAssetCount: (count: number) => void
}

type ReturnProps = {
  sortedAssetSummary: AssetSummary[]
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

  const filteredIds = useAssetFilterStore((state) => state.filteredIds)

  const filterAppliedSortedAssetSummaries = useMemo(() => {
    if (filteredIds === null) {
      return reverseOrder
        ? [...sortedAssetSummaries].reverse()
        : sortedAssetSummaries
    }

    const filterApplied = sortedAssetSummaries.filter((asset) =>
      filteredIds.includes(asset.id),
    )

    return reverseOrder ? filterApplied.reverse() : filterApplied
  }, [filteredIds, reverseOrder, sortedAssetSummaries])

  const [prevShowingAssetCount, setPrevShowingAssetCount] = useState(-1)
  if (prevShowingAssetCount !== filterAppliedSortedAssetSummaries.length) {
    setShowingAssetCount(filterAppliedSortedAssetSummaries.length)
    setPrevShowingAssetCount(filterAppliedSortedAssetSummaries.length)
  }

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
    sortedAssetSummary: filterAppliedSortedAssetSummaries,
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
