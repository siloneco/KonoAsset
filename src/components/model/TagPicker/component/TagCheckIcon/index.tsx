import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

type Props = {
  tag: string
  selectedTags: string[]
}

const TagCheckIcon = ({ tag, selectedTags }: Props) => (
  <Check
    className={cn(
      'mr-2 h-4 w-4',
      selectedTags.includes(tag) ? 'opacity-100' : 'opacity-0',
    )}
  />
)

export default TagCheckIcon
