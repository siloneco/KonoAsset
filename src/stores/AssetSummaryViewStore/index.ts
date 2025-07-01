import { AssetSummary, SortBy } from '@/lib/bindings'
import { create } from 'zustand'
import { refreshAssetSummaries } from './logic'

export type AssetViewStyle = 'Small' | 'Medium' | 'Large' | 'List'

type Props = {
  sortedAssetSummaries: AssetSummary[]
  sortBy: SortBy
  reverseOrder: boolean
  assetViewStyle: AssetViewStyle

  refreshAssetSummaries: () => Promise<void>
  deleteAssetSummaryFromFrontend: (id: string) => void
  setSort: (sortBy: SortBy, reverseOrder: boolean) => Promise<void>
  setAssetViewStyle: (assetViewStyle: AssetViewStyle) => void
}

export const useAssetSummaryViewStore = create<Props>((set, get) => ({
  sortedAssetSummaries: [],
  sortBy: 'CreatedAt',
  reverseOrder: true,
  assetViewStyle: 'Medium',

  refreshAssetSummaries: async () => {
    const sortBy = get().sortBy

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
  setSort: async (sortBy, reverseOrder) => {
    const prevSortBy = get().sortBy

    if (sortBy === prevSortBy) {
      set({
        reverseOrder,
      })
      return
    }

    const result = await refreshAssetSummaries(sortBy)
    set({
      sortedAssetSummaries: result,
      sortBy,
      reverseOrder,
    })
  },
  setAssetViewStyle: (assetViewStyle) => set({ assetViewStyle }),
}))
