import { SquareImage } from '@/components/model/SquareImage'
import { Card } from '@/components/ui/card'
import { AssetSummary } from '@/lib/bindings'
import { cn } from '@/lib/utils'
import { FC, ReactNode } from 'react'

type Props = {
  children?: ReactNode
  className?: string
  asset: AssetSummary
}

export const SlimAssetDetail: FC<Props> = ({ children, className, asset }) => {
  return (
    <Card className={cn('w-full flex flex-row p-2 space-x-4 gap-0', className)}>
      <div
        className={cn(
          'w-2 h-12 rounded-full',
          asset.assetType === 'Avatar' && 'bg-avatar',
          asset.assetType === 'AvatarWearable' && 'bg-avatar-wearable',
          asset.assetType === 'WorldObject' && 'bg-world-object',
          asset.assetType === 'OtherAsset' && 'bg-other-asset',
        )}
      />
      <div className="w-12 h-12">
        <SquareImage
          assetType={asset.assetType}
          filename={asset.imageFilename ?? undefined}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="w-full truncate">{asset.name}</p>
        <p className="text-muted-foreground truncate w-full">{asset.creator}</p>
      </div>
      <div className="space-x-2 flex flex-row items-center">{children}</div>
    </Card>
  )
}
