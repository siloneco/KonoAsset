import { AssetDisplay, CheckForUpdateResult, SortBy } from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'

export const refreshAssets = async (
  sortBy: SortBy,
  setAssetDisplaySortedList: (assets: AssetDisplay[]) => void,
) => {
  const assets: AssetDisplay[] = await invoke('get_sorted_assets_for_display', {
    sortBy: sortBy,
  })

  setAssetDisplaySortedList(assets)
}

export const checkForUpdate = async (): Promise<boolean> => {
  const result: CheckForUpdateResult = await invoke('check_for_update')
  return result.success && result.update_available
}

export const executeUpdate = async () => {
  await invoke('execute_update')
}

export const dismissUpdate = async () => {
  await invoke('do_not_notify_update')
}
