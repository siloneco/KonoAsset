import { useState } from 'react'
import { AssetCardSize, PersistentContextType } from '..'
import { SortBy } from '@/lib/bindings'

type ReturnProps = {
  persistentContextValue: PersistentContextType
}

export const usePersistentContext = (): ReturnProps => {
  const [sortBy, setSortBy] = useState<SortBy>('CreatedAt')
  const [reverseOrder, setReverseOrder] = useState(true)

  const [assetCardSize, setAssetCardSize] = useState<AssetCardSize>('Medium')

  const persistentContextValue: PersistentContextType = {
    sortBy: sortBy,
    setSortBy: setSortBy,
    reverseOrder: reverseOrder,
    setReverseOrder: setReverseOrder,

    assetCardSize: assetCardSize,
    setAssetCardSize: setAssetCardSize,
  }

  return { persistentContextValue }
}
