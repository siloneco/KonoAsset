import { LocalizedChanges } from '@/lib/bindings'
import { FC } from 'react'
import { ChangelogLineEntry } from '../ChangelogLineEntry'
import { Bug, Cog, Rocket } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  change: LocalizedChanges
}

export const ChangelogVersionSection: FC<Props> = ({ change }) => {
  const { t } = useLocalization()

  return (
    <div>
      <Label className="text-2xl">{change.version}</Label>
      <div className="mt-2 space-y-1">
        {change.features !== null &&
          change.features.map((feature, index) => (
            <ChangelogLineEntry
              key={`feature-${index}`}
              icon={<Rocket />}
              title={t('top:update-dialog:changelog:prefix:new-feature')}
              text={feature}
              titleClassName="bg-blue-200 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
            />
          ))}
        {change.fixes !== null &&
          change.fixes.map((fix, index) => (
            <ChangelogLineEntry
              key={`fix-${index}`}
              icon={<Bug />}
              title={t('top:update-dialog:changelog:prefix:bug-fixes')}
              text={fix}
              titleClassName="bg-red-200 text-red-800 dark:bg-red-950 dark:text-red-400"
            />
          ))}

        {change.others !== null &&
          change.others.map((other, index) => (
            <ChangelogLineEntry
              key={`other-${index}`}
              icon={<Cog />}
              title={t('top:update-dialog:changelog:prefix:others')}
              text={other}
              titleClassName="bg-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
            />
          ))}
      </div>
    </div>
  )
}
