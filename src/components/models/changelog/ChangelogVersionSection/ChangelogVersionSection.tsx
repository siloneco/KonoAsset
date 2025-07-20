import { LocalizedChanges } from '@/lib/bindings'
import { FC } from 'react'
import { Label } from '@/components/ui/label'
import { ChangelogLineEntry } from '../ChangelogLineEntry'

type Props = {
  className?: string
  change: LocalizedChanges
}

export const ChangelogVersionSection: FC<Props> = ({ className, change }) => {
  return (
    <div className={className}>
      <Label className="text-2xl flex flex-row items-end">
        {change.version}
        {change.pre_release && (
          <div className="border-2 border-primary text-foreground rounded-full text-sm px-3 ml-2">
            Pre-Release
          </div>
        )}
      </Label>
      <div className="mt-2 space-y-1">
        {change.features !== null &&
          change.features.map((entry, index) => (
            <ChangelogLineEntry key={`feature-${index}`} variant="features">
              {entry}
            </ChangelogLineEntry>
          ))}
        {change.fixes !== null &&
          change.fixes.map((entry, index) => (
            <ChangelogLineEntry key={`fix-${index}`} variant="fixes">
              {entry}
            </ChangelogLineEntry>
          ))}

        {change.others !== null &&
          change.others.map((entry, index) => (
            <ChangelogLineEntry key={`other-${index}`} variant="others">
              {entry}
            </ChangelogLineEntry>
          ))}
      </div>
    </div>
  )
}
