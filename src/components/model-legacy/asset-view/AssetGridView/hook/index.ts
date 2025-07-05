import { useGetElementProperty } from '@/hooks/use-get-element-property'
import { AssetSummary } from '@/lib/bindings'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { calculateColumnCount } from '../logic'
import { useThrottle } from '@/hooks/use-throttle'

type Props = {
  sortedAssetSummary: AssetSummary[]
  layoutDivRef: React.RefObject<HTMLDivElement | null>
}

type ReturnProps = {
  assetRows: AssetSummary[][]
  gridColumnCount: number
}

export const useAssetGridView = ({
  sortedAssetSummary,
  layoutDivRef,
}: Props): ReturnProps => {
  const [initialized, setInitialized] = useState(false)
  const { getElementProperty } = useGetElementProperty(layoutDivRef)

  const displayStyle = useAssetSummaryViewStore((state) => state.displayStyle)

  let initialGridColumnCount = 0
  if (!initialized) {
    initialGridColumnCount =
      displayStyle !== 'List'
        ? calculateColumnCount(getElementProperty('width'), displayStyle)
        : 0

    setInitialized(true)
  }

  const [gridColumnCount, setGridColumnCount] = useState(initialGridColumnCount)
  const throttledGridColumnCount = useThrottle(gridColumnCount, 50)

  const updateColumns = useCallback(() => {
    setGridColumnCount(
      displayStyle !== 'List'
        ? calculateColumnCount(getElementProperty('width'), displayStyle)
        : 1,
    )
  }, [displayStyle, getElementProperty])

  useEffect(() => {
    updateColumns()

    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [displayStyle, updateColumns])

  const assetRows = useMemo(() => {
    const rows: AssetSummary[][] = []

    if (throttledGridColumnCount === 0) {
      return []
    }

    for (
      let i = 0;
      i < sortedAssetSummary.length;
      i += throttledGridColumnCount
    ) {
      rows.push(sortedAssetSummary.slice(i, i + throttledGridColumnCount))
    }

    return rows
  }, [sortedAssetSummary, throttledGridColumnCount])

  return {
    assetRows,
    gridColumnCount: throttledGridColumnCount,
  }
}
