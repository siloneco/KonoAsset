import { AssetSummary, commands, SortBy } from '@/lib/bindings'

export const refreshAssets = async (
  sortBy: SortBy,
): Promise<AssetSummary[] | null> => {
  const result = await commands.getSortedAssetSummaries(sortBy)

  if (result.status === 'error') {
    console.error(result.error)
    return null
  }

  return result.data
}
