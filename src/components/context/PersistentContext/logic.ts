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

export const checkForUpdate = async (): Promise<boolean> => {
  const result = await commands.checkForUpdate()
  return result.status === 'ok' && result.data
}

export const executeUpdate = async () => {
  await commands.executeUpdate()
}

export const dismissUpdate = async () => {
  await commands.doNotNotifyUpdate()
}
