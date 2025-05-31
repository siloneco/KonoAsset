import { AssetCardSize } from '@/components/context/PersistentContext'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { calculateColumnCount } from '../logic'
import { useGetElementProperty } from '@/hooks/use-get-element-property'

type Props = {
  assetCardSize: AssetCardSize
}

type ReturnProps = {
  layoutDivRef: RefObject<HTMLDivElement | null>
  layout: 'Grid' | 'List'
  gridColumnCount: number
}

export const useAssetView = ({ assetCardSize }: Props): ReturnProps => {
  const [gridColumnCount, setGridColumnCount] = useState(1)

  const layoutDivRef = useRef<HTMLDivElement>(null)
  const { getElementProperty } = useGetElementProperty(layoutDivRef)

  const updateGridColumnCount = useCallback(() => {
    setGridColumnCount(
      assetCardSize !== 'List'
        ? calculateColumnCount(getElementProperty('width'), assetCardSize)
        : 1,
    )
  }, [assetCardSize, getElementProperty])

  useEffect(() => {
    updateGridColumnCount()

    window.addEventListener('resize', updateGridColumnCount)
    return () => window.removeEventListener('resize', updateGridColumnCount)
  }, [updateGridColumnCount])

  return {
    layoutDivRef,
    layout: assetCardSize === 'List' ? 'List' : 'Grid',
    gridColumnCount,
  }
}
