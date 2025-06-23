import { SortBy, AssetSummary, commands } from '@/lib/bindings'

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
