import { Badge } from '@/components/ui/badge'
import { AssetType } from '@/lib/bindings'
import { useLocalization } from '@/hooks/use-localization'
import { cn } from '@/lib/utils'
import { FC } from 'react'

type Props = {
  className?: string
  type: AssetType
  onClick?: () => void
}

const generateClassName = (className?: string, onClick?: () => void) => {
  return cn(
    'block truncate select-none shrink',
    onClick && 'cursor-pointer',
    className,
  )
}

export const AssetCardTypeBadge: FC<Props> = ({ className, type, onClick }) => {
  const { t } = useLocalization()

  if (type === 'Avatar') {
    return (
      <Badge
        variant="avatar"
        className={generateClassName(className, onClick)}
        onClick={onClick}
      >
        {t('general:typeavatar')}
      </Badge>
    )
  }
  if (type === 'AvatarWearable') {
    return (
      <Badge
        variant="avatarWearable"
        className={generateClassName(className, onClick)}
        onClick={onClick}
      >
        {t('general:typeavatarwearable')}
      </Badge>
    )
  }
  if (type === 'WorldObject') {
    return (
      <Badge
        variant="worldObject"
        className={generateClassName(className, onClick)}
        onClick={onClick}
      >
        {t('general:typeworldobject')}
      </Badge>
    )
  }
  if (type === 'OtherAsset') {
    return (
      <Badge
        variant="otherAsset"
        className={generateClassName(className, onClick)}
        onClick={onClick}
      >
        {t('general:typeotherasset')}
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className={generateClassName(className, onClick)}
      onClick={onClick}
    >
      Unknown
    </Badge>
  )
}
