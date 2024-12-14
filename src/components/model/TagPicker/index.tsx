'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { PlusIcon } from 'lucide-react'
import { FC } from 'react'
import TagListCommandItems from './component/TagListCommandItems'
import { useTagPicker } from './hook'
import { cn } from '@/lib/utils'

type Props = {
  tags: string[]
  setTags: (_tags: string[]) => void
  className?: string
}

const TagPicker: FC<Props> = ({ tags, setTags, className }) => {
  const { sortedAllTags, setSortedAllTags } = useTagPicker()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('w-6 h-6', className)}
        >
          <PlusIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="タグを検索" />
          <CommandList>
            <CommandEmpty>タグが見つかりません</CommandEmpty>
            <CommandGroup>
              <TagListCommandItems
                sortedSelectedTags={tags}
                setSortedSelectedTags={setTags}
                sortedAllTags={sortedAllTags}
                setSortedAllTags={setSortedAllTags}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TagPicker
