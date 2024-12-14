import { badgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { FC } from 'react'

type Props = {
  tags: string[]
  className?: string
  children?: React.ReactNode
}

const TagList: FC<Props> = ({ tags, className, children }) => {
  return (
    <div className={cn('flex flex-wrap items-center', className)}>
      {children}
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            badgeVariants({ variant: 'default' }),
            'block text-xs h-6 truncate rounded-md mr-2 mb-2',
            className,
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export default TagList
