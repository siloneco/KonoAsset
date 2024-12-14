import { CommandItem } from '@/components/ui/command'
import { Loader2, PlusIcon } from 'lucide-react'
import { FC } from 'react'
import useTagListCommandItems from './hook'
import { toggleTagSelecting } from '../../logic'
import TagCheckIcon from '../TagCheckIcon'

type Props = {
  sortedAllTags: string[]
  setSortedAllTags: (_tags: string[]) => void
  sortedSelectedTags: string[]
  setSortedSelectedTags: (_tags: string[]) => void
}

const TagListCommandItems: FC<Props> = ({
  sortedAllTags,
  setSortedAllTags,
  sortedSelectedTags,
  setSortedSelectedTags,
}) => {
  const {
    newTagValue,
    setNewTagValue,
    creatingTag,
    handleKeyDownForCreatingTagInput,
  } = useTagListCommandItems({
    sortedAllTags,
    setSortedAllTags,
    sortedSelectedTags,
    setSortedSelectedTags,
  })

  return (
    <>
      {sortedAllTags.map((tag: string) => (
        <CommandItem
          value={tag}
          key={tag}
          onSelect={() => {
            toggleTagSelecting({
              tag,
              sortedSelectedTags,
              setSortedSelectedTags,
            })
          }}
        >
          <TagCheckIcon tag={tag} selectedTags={sortedSelectedTags} />
          <span className="truncate w-32">{tag}</span>
        </CommandItem>
      ))}
      <CommandItem>
        {!creatingTag && <PlusIcon className="mr-2 h-4 w-4 opacity-60" />}
        {creatingTag && (
          <Loader2 className="mr-2 h-4 w-4 opacity-60 animate-spin" />
        )}
        <input
          placeholder="新しいタグを作成"
          className="bg-transparent outline-none w-32"
          value={newTagValue}
          onChange={(e) => setNewTagValue(e.target.value)}
          disabled={creatingTag}
          onKeyDown={handleKeyDownForCreatingTagInput}
        />
      </CommandItem>
    </>
  )
}

export default TagListCommandItems
