import { Badge } from '@/components/ui/badge'
import { AssetType } from '@/lib/bindings'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  className?: string
  type: AssetType
  onClick?: () => void
}

const AssetBadge = ({ type, className, onClick }: Props) => {
  const { t } = useLocalization()
  if (type === 'Avatar') {
    return (
      <Badge variant="avatar" className={className} onClick={onClick}>
        {t('general:typeavatar')}
      </Badge>
    )
  }
  if (type === 'AvatarWearable') {
    return (
      <Badge variant="avatarWearable" className={className} onClick={onClick}>
        {t('general:typeavatarwearable')}
      </Badge>
    )
  }
  if (type === 'WorldObject') {
    return (
      <Badge variant="worldObject" className={className} onClick={onClick}>
        {t('general:typeworldobject')}
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={className} onClick={onClick}>
      Unknown
    </Badge>
  )
}

export default AssetBadge
