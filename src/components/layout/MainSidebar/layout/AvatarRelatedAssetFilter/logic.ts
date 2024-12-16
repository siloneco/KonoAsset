import { Option } from '@/components/ui/multi-select'
import { invoke } from '@tauri-apps/api/core'

export const fetchAllCategories = async (): Promise<Option[]> => {
  const categories: string[] = await invoke('get_avatar_related_categories')

  return categories.map((category) => {
    return { label: category, value: category }
  })
}

export const fetchAllSupportedAvatars = async (): Promise<Option[]> => {
  const supportedAvatars: string[] = await invoke(
    'get_avatar_related_supported_avatars',
  )

  return supportedAvatars.map((avatar) => {
    return { label: avatar, value: avatar }
  })
}

export const fetchAllTags = async (): Promise<Option[]> => {
  const tags: string[] = await invoke('get_all_asset_tags')

  return tags.map((tag) => {
    return { label: tag, value: tag }
  })
}
