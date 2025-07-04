import { SortBy, AssetSummary, commands, AppState } from '@/lib/bindings'

export const refreshAssetSummaries = async (
  sortBy: SortBy,
): Promise<AssetSummary[]> => {
  const result = await commands.getSortedAssetSummaries(sortBy)

  if (result.status === 'error') {
    console.error(result.error)
    return []
  }

  return result.data
}

export const saveAppState = async (state: AppState): Promise<void> => {
  const result = await commands.saveAppState(state)

  if (result.status === 'error') {
    console.error(result.error)
  }
}
