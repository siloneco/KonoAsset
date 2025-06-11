import { LogEntry } from '@/lib/bindings'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { FC } from 'react'

type Props = {
  log: LogEntry
}

const logVariants = cva('w-[270px] border-l-4 pl-1', {
  variants: {
    variant: {
      Error: 'border-red-400 dark:border-red-500',
      Warn: 'border-yellow-400 dark:border-yellow-500',
      Info: 'border-green-400 dark:border-green-500',
      Debug: 'border-blue-600 dark:border-blue-500',
      Trace: 'border-sky-400 dark:border-sky-300',
    },
  },
})

export const LogTray: FC<Props> = ({ log }) => {
  return (
    <div className="flex flex-row items-center whitespace-nowrap">
      <p
        className={cn(
          logVariants({ variant: log.level }),
          'text-muted-foreground',
        )}
      >
        {log.time}
      </p>
      <p className="w-16">{log.level}: </p>
      <p className="text-foreground">{log.message}</p>
    </div>
  )
}
