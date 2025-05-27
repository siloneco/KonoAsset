import { useCallback, useState } from 'react'
import {
  AssetFilterContextType,
  AssetFilterCriteria,
} from '../AssetFilterContext'
import { DEFAULT_CRITERIA } from '../AssetFilterContext.constants'
import { getFilteredAssetIds } from '../logic'

type ReturnProps = {
  providerValue: AssetFilterContextType
}

export const useAssetFilterContext = (): ReturnProps => {
  const [criteria, setCriteria] =
    useState<AssetFilterCriteria>(DEFAULT_CRITERIA)
  const [matchedAssetIds, setMatchedAssetIds] = useState<string[] | null>(null)

  const updateFilter = useCallback(
    (updateCriteria: Partial<AssetFilterCriteria>) => {
      const newCriteria = { ...criteria, ...updateCriteria }
      setCriteria(newCriteria)

      getFilteredAssetIds(newCriteria).then((assetIds) => {
        setMatchedAssetIds(assetIds)
      })
    },
    [criteria, setCriteria],
  )

  const clearFilters = useCallback(() => {
    setCriteria(DEFAULT_CRITERIA)
  }, [setCriteria])

  return {
    providerValue: {
      ...criteria,
      matchedAssetIds,
      updateFilter,
      clearFilters,
    },
  }
}
