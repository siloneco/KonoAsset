import { cn } from '@/lib/utils'
import { FC, ReactNode } from 'react'

type Props = {
  icon: ReactNode
  title: string
  text: string
  className?: string
  titleClassName?: string
  textClassName?: string
}

export const ChangelogLineEntry: FC<Props> = ({
  icon,
  title,
  text,
  className,
  titleClassName,
  textClassName,
}) => {
  return (
    <div className={cn('flex flex-row space-x-2 w-full', className)}>
      <div
        className={cn(
          'flex items-center text-sm font-bold rounded-lg w-fit px-2 [&_svg]:size-4 bg-green-950 text-green-500',
          titleClassName,
        )}
      >
        <span className="mr-1">{icon}</span>
        <span>{title}</span>
      </div>
      <span className={cn('w-32 flex-grow truncate', textClassName)}>
        {text}
      </span>
    </div>
  )
}
