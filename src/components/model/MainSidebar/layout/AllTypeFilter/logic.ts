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

  const map = new Map<string, number>()

  avatarWearableCategoryResult.data.forEach((category) => {
    const existingPriority = map.get(category.value)

    if (existingPriority === undefined) {
      map.set(category.value, category.priority)
    } else {
      map.set(category.value, existingPriority + category.priority)
    }
  })

  worldObjectCategoryResult.data.forEach((category) => {
    const existingPriority = map.get(category.value)

    if (existingPriority === undefined) {
      map.set(category.value, category.priority)
    } else {
      map.set(category.value, existingPriority + category.priority)
    }
  })

  const categories = Array.from(map.entries()).map(([value, priority]) => {
    return { label: value, value, priority }
  })

  return categories
}

export const fetchAllSupportedAvatars = async (): Promise<Option[]> => {
  const result = await commands.getAvatarWearableSupportedAvatars()

  if (result.status === 'error') {
    console.error(result.error)
    return []
  }

  return result.data.map((avatar) => {
    return {
      label: avatar.value,
      value: avatar.value,
      priority: avatar.priority,
    }
  })
}
