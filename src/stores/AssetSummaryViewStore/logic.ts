import { SortBy, AssetSummary, commands, AppState } from '@/lib/bindings'
import { DEFAULT_APP_STATE } from './index.constants'

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

export const fetchAppState = async (): Promise<AppState> => {
  const result = await commands.getAppState()

  if (result.status === 'error') {
    console.error(result.error)
    return DEFAULT_APP_STATE
  }

  return result.data
}

export const saveAppState = async (state: AppState): Promise<void> => {
  const result = await commands.saveAppState(state)

  if (result.status === 'error') {
    console.error(result.error)
  }
}
