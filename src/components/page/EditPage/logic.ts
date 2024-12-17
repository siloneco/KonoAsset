import { Option } from '@/components/ui/multi-select'
import { GetAssetResult } from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'

export const fetchSupportedAvatars = async (): Promise<Option[]> => {
  const result: string[] = await invoke('get_all_supported_avatar_values')

  const options = result.map((value) => {
    return { label: value, value }
  })

  return options
}

export const fetchCategoryCandidates = async () => {
  const result: string[] = await invoke('get_avatar_related_categories')
  return result
}

export const fetchAssetInformation = async (
  id: string,
): Promise<GetAssetResult> => {
  return (await invoke('get_asset', { id })) as GetAssetResult
}
