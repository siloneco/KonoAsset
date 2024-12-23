import { Badge } from '@/components/ui/badge'
import { AssetType } from '@/lib/entity'

type Props = {
  className?: string
  type: AssetType
  onClick?: () => void
}

const AssetBadge = ({ type, className, onClick }: Props) => {
  if (type === AssetType.Avatar) {
    return (
      <Badge variant="avatar" className={className} onClick={onClick}>
        アバター素体
      </Badge>
    )
  }
  if (type === AssetType.AvatarRelated) {
    return (
      <Badge variant="avatarRelated" className={className} onClick={onClick}>
        アバター関連
      </Badge>
    )
  }
  if (type === AssetType.World) {
    return (
      <Badge variant="world" className={className} onClick={onClick}>
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
