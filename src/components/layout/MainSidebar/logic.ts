import { Option } from '@/components/ui/multi-select'
import { invoke } from '@tauri-apps/api/core'

export const fetchAllTags = async (): Promise<Option[]> => {
  const tags: string[] = await invoke('get_all_asset_tags')

  return tags.map((tag) => {
    return { label: tag, value: tag }
  })
}
