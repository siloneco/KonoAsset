import {
  AppState,
  AssetSummary,
  commands,
  DisplayStyle,
  SortBy,
} from '@/lib/bindings'
import { create } from 'zustand'
import { refreshAssetSummaries, saveAppState } from './logic'

type Props = {
  sortedAssetSummaries: AssetSummary[]
  sortBy: SortBy
  reverseOrder: boolean
  displayStyle: DisplayStyle

  refreshAssetSummaries: () => Promise<void>
  deleteAssetSummaryFromFrontend: (id: string) => void
  setSort: (
    sortBy: SortBy,
    reverseOrder: boolean,
    skipSave?: boolean,
  ) => Promise<void>
  setDisplayStyle: (displayStyle: DisplayStyle, skipSave?: boolean) => void
}

export const useAssetSummaryViewStore = create<Props>((set, get) => ({
  sortedAssetSummaries: [],
  sortBy: 'CreatedAt',
  reverseOrder: true,
  displayStyle: 'GridMedium',

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
  setSort: async (sortBy, reverseOrder, skipSave = false) => {
    const prev = get()
    const prevSortBy = prev.sortBy
    const prevDisplayStyle = prev.displayStyle

    if (sortBy === prevSortBy) {
      set({
        reverseOrder,
      })
    } else {
      const result = await refreshAssetSummaries(sortBy)
      set({
        sortedAssetSummaries: result,
        sortBy,
        reverseOrder,
      })
    }

    if (skipSave) {
      return
    }

    const appState: AppState = {
      sort: { sortBy, reversed: reverseOrder },
      displayStyle: prevDisplayStyle,
    }

    saveAppState(appState).catch((error) => {
      console.error(error)
    })
  },
  setDisplayStyle: (displayStyle, skipSave = false) => {
    const prev = get()

    set({ displayStyle })

    if (skipSave) {
      return
    }

    const appState: AppState = {
      sort: { sortBy: prev.sortBy, reversed: prev.reverseOrder },
      displayStyle,
    }

    saveAppState(appState).catch((error) => {
      console.error(error)
    })
  },
}))

commands.getAppState().then((result) => {
  if (result.status === 'error') {
    console.error(result.error)
    return
  }

  const { sort, displayStyle } = result.data

  useAssetSummaryViewStore.setState({
    sortBy: sort.sortBy,
    reverseOrder: sort.reversed,
    displayStyle,
  })
})
