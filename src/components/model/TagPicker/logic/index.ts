import { invoke } from '@tauri-apps/api/core'

type ToggleTagSelectingProps = {
  tag: string
  sortedSelectedTags: string[]
  setSortedSelectedTags: (_selectedTags: string[]) => void
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
  return (await invoke('get_all_asset_tags')) as string[]
}
