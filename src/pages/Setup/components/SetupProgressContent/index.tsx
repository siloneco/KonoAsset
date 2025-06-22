import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

type Props = {
  index: number
  currentIndex: number
  children: React.ReactNode
}

export const SetupProgressContent: React.FC<Props> = ({
  index,
  currentIndex,
  children,
}) => {
  return (
    <div className="flex flex-row space-x-2">
      <div
        className={cn(
          'h-8 w-8 rounded-full border-foreground flex items-center justify-center border dark:border-2',
          index < currentIndex &&
            'border-2 border-green-500 text-green-500 dark:border-green-400 dark:text-green-400',
        )}
      >
        {index >= currentIndex && index}
        {index < currentIndex && <Check size={16} />}
      </div>
      <div
        className={cn(
          'flex items-center border-primary',
          index == currentIndex && 'border-b-2',
        )}
      >
        {children}
      </div>
    </div>
  )
}
