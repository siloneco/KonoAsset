import { Option } from '@/components/ui/multi-select'
import { commands } from '@/lib/bindings'

export const fetchAvatarWearableCategories = async (
  allowedIds: string[] | null,
): Promise<Option[]> => {
  const result = await commands.getAvatarWearableCategories(allowedIds)

  if (result.status === 'error') {
    console.error(result.error)
    return []
  }

  return result.data.map((entry) => {
    return { label: entry.value, value: entry.value, priority: entry.priority }
  })
}

export const fetchAllSupportedAvatars = async (
  allowedIds: string[] | null,
): Promise<Option[]> => {
  const result = await commands.getAvatarWearableSupportedAvatars(allowedIds)

  if (result.status === 'error') {
    console.error(result.error)
    return []
  }

  return result.data.map((entry) => {
    return { label: entry.value, value: entry.value, priority: entry.priority }
  })
}
