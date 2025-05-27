import { Badge } from '@/components/ui/badge'
import { AssetType } from '@/lib/bindings'
import { useLocalization } from '@/hooks/use-localization'
import { cn } from '@/lib/utils'
import { FC, ReactNode } from 'react'

type Props = {
  className?: string
  type: AssetType
  onClick?: () => void
}

type InternalProps = {
  children: ReactNode
  className?: string
  onClick?: () => void
}

const AssetCardTypeBadgeAvatar: FC<InternalProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <Badge
      variant="avatar"
      className={cn(
        'block truncate',
        { 'cursor-pointer': onClick !== undefined },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Badge>
  )
}

const AssetCardTypeBadgeAvatarWearable: FC<InternalProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <Badge
      variant="avatarWearable"
      className={cn(
        'block truncate',
        { 'cursor-pointer': onClick !== undefined },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Badge>
  )
}

const AssetCardTypeBadgeWorldObject: FC<InternalProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <Badge
      variant="worldObject"
      className={cn(
        'block truncate',
        { 'cursor-pointer': onClick !== undefined },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Badge>
  )
}

export const AssetCardTypeBadge: FC<Props> = ({ type, className, onClick }) => {
  const { t } = useLocalization()

  if (type === 'Avatar') {
    return (
      <AssetCardTypeBadgeAvatar className={className} onClick={onClick}>
        {t('general:typeavatar')}
      </AssetCardTypeBadgeAvatar>
    )
  }

  if (type === 'AvatarWearable') {
    return (
      <AssetCardTypeBadgeAvatarWearable className={className} onClick={onClick}>
        {t('general:typeavatarwearable')}
      </AssetCardTypeBadgeAvatarWearable>
    )
  }

  if (type === 'WorldObject') {
    return (
      <AssetCardTypeBadgeWorldObject className={className} onClick={onClick}>
        {t('general:typeworldobject')}
      </AssetCardTypeBadgeWorldObject>
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn('block truncate', className)}
      onClick={onClick}
    >
      Unknown
    </Badge>
  )
}
