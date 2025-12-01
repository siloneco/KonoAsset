import { AssetSummary } from '@/lib/bindings'
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
}

export const useAssetView = ({ setShowingAssetCount }: Props): ReturnProps => {
  const layoutDivRef = useRef<HTMLDivElement | null>(null)

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

  return {
    layoutDivRef,
    sortedAssetSummary: filterAppliedSortedAssetSummaries,
    displayStyle: displayStyle === 'List' ? 'List' : 'Grid',
    background: sortedAssetSummaries.length === 0 ? 'NoAssets' : 'NoResults',
  }
}
