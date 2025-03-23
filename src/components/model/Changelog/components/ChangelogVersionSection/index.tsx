import { LocalizedChanges } from '@/lib/bindings'
import { FC } from 'react'
import { ChangelogLineEntry } from '../ChangelogLineEntry'
import { Bug, Cog, Rocket } from 'lucide-react'
import { Label } from '@/components/ui/label'

type Props = {
  change: LocalizedChanges
}

export const ChangelogVersionSection: FC<Props> = ({ change }) => {
  return (
    <div>
      <Label className="text-2xl">{change.target_version}</Label>
      <div className="mt-2 space-y-1">
        {change.features !== null &&
          change.features.map((feature, index) => (
            <ChangelogLineEntry
              key={`feature-${index}`}
              icon={<Rocket />}
              title="新機能"
              text={feature}
              titleClassName="bg-blue-950 text-blue-400"
            />
          ))}
        {change.fixes !== null &&
          change.fixes.map((fix, index) => (
            <ChangelogLineEntry
              key={`fix-${index}`}
              icon={<Bug />}
              title="バグ修正"
              text={fix}
              titleClassName="bg-red-950 text-red-400"
            />
          ))}

        {change.others !== null &&
          change.others.map((other, index) => (
            <ChangelogLineEntry
              key={`other-${index}`}
              icon={<Cog />}
              title="その他"
              text={other}
              titleClassName="bg-yellow-950 text-yellow-400"
            />
          ))}
      </div>
    </div>
  )
}
