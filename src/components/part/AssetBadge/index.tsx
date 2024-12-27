import { Badge } from '@/components/ui/badge'
import { AssetType } from '@/lib/bindings'

type Props = {
  className?: string
  type: AssetType
  onClick?: () => void
}

const AssetBadge = ({ type, className, onClick }: Props) => {
  if (type === 'Avatar') {
    return (
      <Badge variant="avatar" className={className} onClick={onClick}>
        アバター素体
      </Badge>
    )
  }
  if (type === 'AvatarWearable') {
    return (
      <Badge variant="avatarWearable" className={className} onClick={onClick}>
        アバター関連
      </Badge>
    )
  }
  if (type === 'WorldObject') {
    return (
      <Badge variant="worldObject" className={className} onClick={onClick}>
        ワールドアセット
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={className} onClick={onClick}>
      不明
    </Badge>
  )
}

export default AssetBadge
