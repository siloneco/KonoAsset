import { Option } from '@/components/ui/multi-select'
import { invoke } from '@tauri-apps/api/core'

export const fetchAllCategories = async (): Promise<Option[]> => {
  const categories: string[] = await invoke('get_world_categories')

  return categories.map((category) => {
    return { label: category, value: category }
  })
}
