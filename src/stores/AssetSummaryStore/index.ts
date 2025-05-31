import { AssetSummary, SortBy } from '@/lib/bindings'
import { create } from 'zustand'
import { refreshAssetSummaries } from './logic'

type Props = {
  sortedAssetSummaries: AssetSummary[]
  refreshAssetSummaries: (sortBy: SortBy) => Promise<void>
  deleteAssetSummaryFromFrontend: (id: string) => void
}

export const useAssetSummaryStore = create<Props>((set) => ({
  sortedAssetSummaries: [],
  refreshAssetSummaries: async (sortBy: SortBy) => {
    const newValue: Partial<Props> = {
      sortedAssetSummaries: await refreshAssetSummaries(sortBy),
    }
    set(newValue)
  },
  deleteAssetSummaryFromFrontend: (id: string) => {
    set((prev) => {
      const newValue: Partial<Props> = {
        sortedAssetSummaries: prev.sortedAssetSummaries.filter(
          (assetSummary) => assetSummary.id !== id,
        ),
      }
      return newValue
    })
  },
}))
