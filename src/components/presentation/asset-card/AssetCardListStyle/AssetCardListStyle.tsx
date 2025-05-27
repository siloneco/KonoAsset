import { SquareImage } from '../../square-image/SquareImage'
import { Card } from '@/components/ui/card'
import { AssetSummary, Result } from '@/lib/bindings'
import { cn } from '@/lib/utils'
import { FC, ReactNode } from 'react'
import { useAssetCardListStyle } from './hook'

type Props = {
  children?: ReactNode
  className?: string
  asset: AssetSummary
  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
}

export const AssetCardListStyle: FC<Props> = ({
  children,
  className,
  asset,
  resolveImageAbsolutePath,
}) => {
  const { imageSrc, imageLoading } = useAssetCardListStyle({
    imagePath: asset.imageFilename,
    resolveImageAbsolutePath,
  })

  return (
    <Card
      className={cn('w-full flex flex-row p-2 pr-4 space-x-2 gap-0', className)}
    >
      <div
        className={cn(
          'w-2 h-12 rounded-full',
          asset.assetType === 'Avatar' && 'bg-avatar',
          asset.assetType === 'AvatarWearable' && 'bg-avatar-wearable',
          asset.assetType === 'WorldObject' && 'bg-world-object',
        )}
      />
      <div className="size-12">
        <SquareImage
          assetType={asset.assetType}
          src={imageSrc}
          loading={imageLoading}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="w-full truncate">{asset.name}</p>
        <p className="text-muted-foreground truncate w-full">{asset.creator}</p>
      </div>
      <div className="flex flex-row items-center space-x-2">{children}</div>
    </Card>
  )
}
