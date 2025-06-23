import { AssetContextType } from '.'
import { useState } from 'react'

type ReturnProps = {
  value: AssetContextType
}

export const useAssetContext = (): ReturnProps => {
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null)

  const value: AssetContextType = {
    filteredIds: filteredIds,
    setFilteredIds: setFilteredIds,
  }

  return { value }
}
