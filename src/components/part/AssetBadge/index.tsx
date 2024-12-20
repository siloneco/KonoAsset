import { Badge } from '@/components/ui/badge'
import { AssetType } from '@/lib/entity'

type Props = {
  className?: string
  type: AssetType
}

const AssetBadge = ({ type, className }: Props) => {
  if (type === AssetType.Avatar) {
    return (
      <Badge variant="avatar" className={className}>
        アバター素体
      </Badge>
    )
  }
  if (type === AssetType.AvatarRelated) {
    return (
      <Badge variant="avatarRelated" className={className}>
        アバター関連
      </Badge>
    )
  }
  if (type === AssetType.World) {
    return (
      <Badge variant="world" className={className}>
        ワールドアセット
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={className}>
      不明
    </Badge>
  )
}

export default AssetBadge
