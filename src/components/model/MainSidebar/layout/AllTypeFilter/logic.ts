import { Option } from '@/components/ui/multi-select'
import { commands } from '@/lib/bindings'

export const fetchAllCategories = async (): Promise<Option[]> => {
  const avatarWearableCategoryResult =
    await commands.getAvatarWearableCategories()
  if (avatarWearableCategoryResult.status === 'error') {
    console.error(avatarWearableCategoryResult.error)
    return []
  }

  const worldObjectCategoryResult = await commands.getWorldObjectCategories()
  if (worldObjectCategoryResult.status === 'error') {
    console.error(worldObjectCategoryResult.error)
    return []
  }

  // merge the two arrays and remove duplicates
  const categories = [
    ...new Set([
      ...avatarWearableCategoryResult.data,
      ...worldObjectCategoryResult.data,
    ]),
  ]

  return categories.map((category) => {
    return {
      label: category,
      value: category,
    }
  })
}

export const fetchAllSupportedAvatars = async (): Promise<Option[]> => {
  const result = await commands.getAvatarWearableSupportedAvatars()

  if (result.status === 'error') {
    console.error(result.error)
    return []
  }

  return result.data.map((avatar) => {
    return { label: avatar, value: avatar }
  })
}
