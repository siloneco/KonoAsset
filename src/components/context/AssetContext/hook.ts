import { AssetSummary } from '@/lib/bindings'
import { AssetContextType } from '.'
import { useCallback, useContext, useEffect, useState } from 'react'
import { refreshAssets } from './logic'
import { PersistentContext } from '../PersistentContext'

type ReturnProps = {
  value: AssetContextType
}

export const useAssetContext = (): ReturnProps => {
  const [assetDisplaySortedList, setAssetDisplaySortedList] = useState<
    AssetSummary[]
  >([])
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null)

  const { sortBy } = useContext(PersistentContext)

  const refresh = useCallback(async () => {
    const result = await refreshAssets(sortBy)

    if (result !== null) {
      setAssetDisplaySortedList(result)
    }
  }, [sortBy])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value: AssetContextType = {
    assetDisplaySortedList,
    setAssetDisplaySortedList: setAssetDisplaySortedList,

    filteredIds: filteredIds,
    setFilteredIds: setFilteredIds,

    deleteAssetById: async (id: string) => {
      setAssetDisplaySortedList((prev) =>
        prev.filter((asset) => asset.id !== id),
      )
    },

    refreshAssets: refresh,
  }

  return { value }
}
