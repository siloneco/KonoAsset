import { commands } from '@/lib/bindings'

type ToggleTagSelectingProps = {
  tag: string
  sortedSelectedTags: string[]
  setSortedSelectedTags: (selectedTags: string[]) => void
}

export const toggleTagSelecting = ({
  tag,
  sortedSelectedTags,
  setSortedSelectedTags,
}: ToggleTagSelectingProps) => {
  if (sortedSelectedTags.includes(tag)) {
    setSortedSelectedTags(sortedSelectedTags.filter((t) => t !== tag))
  } else {
    setSortedSelectedTags([...sortedSelectedTags, tag].sort())
  }
}

export const getAllAvailableTags = async (): Promise<string[]> => {
  const result = await commands.getAllAssetTags()

  if (result.status === 'error') {
    console.error(result.error)
    return []
  }

  return result.data
}
