import { Option } from '@/components/ui/multi-select'
import { commands } from '@/lib/bindings'

export const fetchAllTags = async (): Promise<Option[]> => {
  const result = await commands.getAllAssetTags()

  if (result.status === 'error') {
    console.error(result.error)
    return []
  }

  return result.data.map((tag) => {
    return { label: tag, value: tag }
  })
}
