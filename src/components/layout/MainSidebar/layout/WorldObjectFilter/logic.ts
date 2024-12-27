import { Option } from '@/components/ui/multi-select'
import { commands } from '@/lib/bindings'

export const fetchAllCategories = async (): Promise<Option[]> => {
  const result = await commands.getWorldObjectCategories()

  if (result.status === 'error') {
    console.error(result.error)
    return []
  }

  return result.data.map((category) => {
    return { label: category, value: category }
  })
}
