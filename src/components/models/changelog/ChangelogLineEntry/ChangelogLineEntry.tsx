import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useLocalization } from '@/hooks/use-localization'
import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Bug, Cog, Rocket } from 'lucide-react'
import { FC, ReactNode } from 'react'
import { getChangelogBadgeLocalizationKey } from './logic'

const changelogBadgeVariants = cva(
  'flex items-center shrink-0 text-sm font-bold rounded-lg w-fit px-2 [&_svg]:size-4',
  {
    variants: {
      variant: {
        features:
          'bg-blue-200 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
        fixes: 'bg-red-200 text-red-800 dark:bg-red-950 dark:text-red-400',
        others:
          'bg-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      },
    },
  },
)

type Props = {
  children: ReactNode
  className?: string
} & VariantProps<typeof changelogBadgeVariants>

export const ChangelogLineEntry: FC<Props> = ({
  children,
  className,
  variant,
}) => {
  const { t } = useLocalization()
  const badgeLocalizationKey = getChangelogBadgeLocalizationKey(variant)

  return (
    <div className={cn('flex flex-row space-x-2 w-full', className)}>
      <div className={changelogBadgeVariants({ variant })}>
        <span className="mr-1">
          {variant === 'features' && <Rocket />}
          {variant === 'fixes' && <Bug />}
          {variant === 'others' && <Cog />}
        </span>
        <span>{t(badgeLocalizationKey)}</span>
      </div>
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <span className="shrink truncate">{children}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{children}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
