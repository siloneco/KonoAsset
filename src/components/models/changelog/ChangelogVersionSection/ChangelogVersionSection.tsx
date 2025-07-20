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
          change.features.map((feature, index) => (
            <ChangelogLineEntry key={`feature-${index}`} variant="features">
              {feature}
            </ChangelogLineEntry>
          ))}
        {change.fixes !== null &&
          change.fixes.map((fix, index) => (
            <ChangelogLineEntry key={`fix-${index}`} variant="fixes">
              {fix}
            </ChangelogLineEntry>
          ))}

        {change.others !== null &&
          change.others.map((other, index) => (
            <ChangelogLineEntry key={`other-${index}`} variant="others">
              {other}
            </ChangelogLineEntry>
          ))}
      </div>
    </div>
  )
}
