import { AssetSummary, commands, SortBy } from '@/lib/bindings'

export const refreshAssets = async (
  sortBy: SortBy,
  setAssetDisplaySortedList: (assets: AssetSummary[]) => void,
) => {
  const result = await commands.getSortedAssetsForDisplay(sortBy)

  if (result.status === 'ok') {
    setAssetDisplaySortedList(result.data)
  } else {
    console.error(result.error)
  }
}
