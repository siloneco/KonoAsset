import { AssetSummary, FileInfo } from '@/lib/bindings'
import { useCallback, useEffect, useState } from 'react'
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

  const [
    filterAppliedSortedAssetSummaries,
    setFilterAppliedSortedAssetSummaries,
  ] = useState<AssetSummary[]>([])

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

  const filteredIds = useAssetFilterStore((state) => state.filteredIds)

  useEffect(() => {
    refreshAssetSummaries()
  }, [refreshAssetSummaries])

  const updateSortedAssetSummary = useCallback(async () => {
    if (filteredIds === null) {
      setFilterAppliedSortedAssetSummaries(
        reverseOrder
          ? [...sortedAssetSummaries].reverse()
          : sortedAssetSummaries,
      )

      setShowingAssetCount(sortedAssetSummaries.length)
      return
    }

    const filterApplied = sortedAssetSummaries.filter((asset) =>
      filteredIds.includes(asset.id),
    )

    setFilterAppliedSortedAssetSummaries(
      reverseOrder ? filterApplied.reverse() : filterApplied,
    )
    setShowingAssetCount(filterApplied.length)
  }, [filteredIds, reverseOrder, setShowingAssetCount, sortedAssetSummaries])

  useEffect(() => {
    updateSortedAssetSummary()
  }, [updateSortedAssetSummary])

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
