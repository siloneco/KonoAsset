import { Option } from '@/components/ui/multi-select'
import { commands } from '@/lib/bindings'

export const fetchAllCategories = async (
  allowedIds: string[] | null,
): Promise<Option[]> => {
  const result = await commands.getOtherAssetCategories(allowedIds)

  if (result.status === 'error') {
    console.error(result.error)
    return []
  }

  return result.data.map((entry) => {
    return { label: entry.value, value: entry.value, priority: entry.priority }
  })
}
