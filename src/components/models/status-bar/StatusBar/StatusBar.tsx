import { FC } from 'react'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'
import { useAssetFilterStore } from '@/stores/AssetFilterStore'
import { InternalStatusBar } from './internal'

type Props = {
  filterAppliedAssetCount?: number
}

export const StatusBar: FC<Props> = ({ filterAppliedAssetCount }) => {
  const clearFilters = useAssetFilterStore((state) => state.clearFilters)
  const sortedAssetSummaries = useAssetSummaryViewStore(
    (state) => state.sortedAssetSummaries,
  )

  return (
    <InternalStatusBar
      totalAssetCount={sortedAssetSummaries.length}
      filterAppliedAssetCount={filterAppliedAssetCount}
      clearFilters={clearFilters}
    />
  )
}
