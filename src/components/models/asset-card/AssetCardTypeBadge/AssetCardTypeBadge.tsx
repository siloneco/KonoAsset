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

type BadgeConfig = {
  variant: 'avatar' | 'avatarWearable' | 'worldObject' | 'otherAsset'
  localizationKey: string
}

const assetTypeBadgeMapping: Record<AssetType, BadgeConfig> = {
  Avatar: {
    variant: 'avatar',
    localizationKey: 'general:typeavatar',
  },
  AvatarWearable: {
    variant: 'avatarWearable',
    localizationKey: 'general:typeavatarwearable',
  },
  WorldObject: {
    variant: 'worldObject',
    localizationKey: 'general:typeworldobject',
  },
  OtherAsset: {
    variant: 'otherAsset',
    localizationKey: 'general:typeotherasset',
  },
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

  const config = assetTypeBadgeMapping[type] || {
    variant: 'outline',
    localizationKey: 'Unknown',
  }

  return (
    <Badge
      variant={config.variant}
      className={generateClassName(className, onClick)}
      onClick={onClick}
    >
      {config.localizationKey === 'Unknown'
        ? config.localizationKey
        : t(config.localizationKey)}
    </Badge>
  )
}
