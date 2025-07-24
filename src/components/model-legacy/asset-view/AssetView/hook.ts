import { AssetSummary, FileInfo } from '@/lib/bindings'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'
import { useShallow } from 'zustand/react/shallow'
import { useAssetFilterStore } from '@/stores/AssetFilterStore'

type Props = {
  setShowingAssetCount: (count: number) => void
}

type ReturnProps = {
  layoutDivRef: React.RefObject<HTMLDivElement | null>
  sortedAssetSummary: AssetSummary[]
  displayStyle: 'Grid' | 'List'
  background: 'NoAssets' | 'NoResults'

  openSelectUnitypackageDialog: (
    assetId: string,
    data: { [x: string]: FileInfo[] },
  ) => void
  openDependencyDialog: (assetName: string, dependencyIds: string[]) => void

  setSelectUnitypackageDialogOpen: (open: boolean) => void
  setDependencyDialogOpen: (open: boolean) => void

  selectUnitypackageDialogOpen: boolean
  selectUnitypackageDialogAssetId: string | null
  unitypackages: { [x: string]: FileInfo[] }
  dependencyDialogOpen: boolean
  dependencyDialogAssetName: string | null
  dependencyDialogDependencies: string[]
}

export const useAssetView = ({ setShowingAssetCount }: Props): ReturnProps => {
  const layoutDivRef = useRef<HTMLDivElement | null>(null)

  const [selectUnitypackageDialogOpen, setSelectUnitypackageDialogOpen] =
    useState(false)
  const [unitypackages, setUnityPackages] = useState<{
    [x: string]: FileInfo[]
  }>({})
  const [selectUnitypackageDialogAssetId, setSelectUnitypackageDialogAssetId] =
    useState<string | null>(null)

  const [dependencyDialogOpen, setDependencyDialogOpen] = useState(false)
  const [dependencyDialogAssetName, setDependencyDialogAssetName] = useState<
    string | null
  >(null)
  const [dependencyDialogDependencies, setDependencyDialogDependencies] =
    useState<string[]>([])

  const {
    sortedAssetSummaries,
    reverseOrder,
    displayStyle,
    refreshAssetSummaries,
  } = useAssetSummaryViewStore(
    useShallow((state) => {
      return {
        sortedAssetSummaries: state.sortedAssetSummaries,
        reverseOrder: state.reverseOrder,
        displayStyle: state.displayStyle,
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

  const openDependencyDialog = (assetName: string, dependencyIds: string[]) => {
    setDependencyDialogAssetName(assetName)
    setDependencyDialogDependencies(dependencyIds)
    setDependencyDialogOpen(true)
  }

  return {
    layoutDivRef,
    sortedAssetSummary: filterAppliedSortedAssetSummaries,
    displayStyle: displayStyle === 'List' ? 'List' : 'Grid',
    background: sortedAssetSummaries.length === 0 ? 'NoAssets' : 'NoResults',

    openSelectUnitypackageDialog,
    openDependencyDialog,

    setSelectUnitypackageDialogOpen,
    setDependencyDialogOpen,

    selectUnitypackageDialogOpen,
    selectUnitypackageDialogAssetId,
    unitypackages,
    dependencyDialogOpen,
    dependencyDialogAssetName,
    dependencyDialogDependencies,
  }
}
