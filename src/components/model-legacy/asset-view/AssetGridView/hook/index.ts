import { useGetElementProperty } from '@/hooks/use-get-element-property'
import { AssetSummary } from '@/lib/bindings'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { calculateColumnCount } from '../logic'
import { useThrottle } from '@/hooks/use-throttle'

type Props = {
  sortedAssetSummary: AssetSummary[]
}

type ReturnProps = {
  assetRows: AssetSummary[][]
  gridColumnCount: number
  divRef: React.RefObject<HTMLDivElement | null>
}

export const useAssetGridView = ({
  sortedAssetSummary,
}: Props): ReturnProps => {
  const divRef = useRef<HTMLDivElement | null>(null)
  const [gridColumnCount, setGridColumnCount] = useState(1)
  const throttledGridColumnCount = useThrottle(gridColumnCount, 50)

  const { getElementProperty } = useGetElementProperty(divRef)

  const displayStyle = useAssetSummaryViewStore((state) => state.displayStyle)

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
    divRef,
  }
}
