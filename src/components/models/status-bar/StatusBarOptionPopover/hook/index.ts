import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'
import { useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { convertToSelectID, handleSortByChange } from '../logic'
import { DisplayStyle } from '@/lib/bindings'

type ReturnProps = {
  displayLayoutValue: string
  sortValue: string
  setSort: (value: string) => void
  setDisplayLayout: (value: string) => void
}

export const useStatusBarOptionPopover = (): ReturnProps => {
  const { sortBy, reverseOrder, setSort, displayLayout, setDisplayLayout } =
    useAssetSummaryViewStore(
      useShallow((state) => ({
        sortBy: state.sortBy,
        reverseOrder: state.reverseOrder,
        setSort: state.setSort,
        displayLayout: state.displayStyle,
        setDisplayLayout: state.setDisplayStyle,
      })),
    )

  const sortValue = useMemo(
    () => convertToSelectID(sortBy, reverseOrder),
    [sortBy, reverseOrder],
  )

  const wrappedSetSort = useCallback(
    (value: string) => {
      handleSortByChange({ value, setSort })
    },
    [setSort],
  )

  const wrappedSetDisplayLayout = useCallback(
    (value: string) => {
      setDisplayLayout(value as DisplayStyle)
    },
    [setDisplayLayout],
  )

  return {
    displayLayoutValue: displayLayout,
    sortValue,
    setSort: wrappedSetSort,
    setDisplayLayout: wrappedSetDisplayLayout,
  }
}
