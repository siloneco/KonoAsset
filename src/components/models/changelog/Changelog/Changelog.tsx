import { LocalizedChanges } from '@/lib/bindings'
import { FC } from 'react'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'
import { ChangelogVersionSection } from '../ChangelogVersionSection'

type Props = {
  changes: LocalizedChanges[] | null
}

export const Changelog: FC<Props> = ({ changes }) => {
  const { t } = useLocalization()

  return (
    <div className="w-full">
      <div className="flex flex-row items-center">
        <Separator className="flex w-32 shrink" />
        <span className="px-4 text-muted-foreground flex shrink-0">
          {t('top:update-dialog:changelog:title')}
        </span>
        <Separator className="flex w-32 shrink" />
      </div>
      <div className="w-full grid grid-cols-1">
        <ScrollArea className="px-2 w-full max-h-72">
          <div className="grid grid-cols-1 pb-2 pr-2 w-full min-w-0 overflow-x-hidden">
            {changes === null && (
              <div className="space-y-1">
                <Skeleton className="w-32 h-6 mb-2" />
                <div className="flex space-x-1">
                  <Skeleton className="w-20 h-5" />
                  <Skeleton className="w-32 h-5" />
                </div>
                <div className="flex space-x-1">
                  <Skeleton className="w-20 h-5" />
                  <Skeleton className="w-52 h-5" />
                </div>
                <div className="flex space-x-1">
                  <Skeleton className="w-20 h-5" />
                  <Skeleton className="w-96 h-5" />
                </div>
              </div>
            )}
            {changes !== null && changes.length === 0 && (
              <div className="text-muted-foreground text-center mt-4">
                {t('top:update-dialog:changelog:not-found')}
              </div>
            )}
            {changes !== null &&
              changes.length > 0 &&
              changes.map((change) => (
                <div key={change.version} className="pb-4 min-w-0">
                  <ChangelogVersionSection change={change} />
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex justify-center p-4">
        <a
          href="https://github.com/siloneco/KonoAsset/blob/develop/CHANGELOG.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary">
            <ExternalLink />
            {t('top:update-dialog:changelog:github')}
          </Button>
        </a>
      </div>
      <Separator className="mt-2" />
    </div>
  )
}
