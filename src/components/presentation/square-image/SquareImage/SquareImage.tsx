import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'
import { AssetType } from '@/lib/bindings'
import { FC } from 'react'
import { SquareImageLoader } from '../SquareImageLoader/SquareImageLoader'
import { SquareImagePathSelector } from '../SquareImagePathSelector'
import { SquareImageSelectFooter } from '../SquareImageSelectFooter'

type Props = {
  src?: string
  indexSelector?: {
    index: number
    maxIndex: number
    setIndex: (index: number) => void
  }
  userImageProvider?: {
    openImagePathSelector: () => Promise<string | null>
    onImagePathProvided: (path: string) => void
  }
  onError?: () => void
  loading: boolean
  assetType: AssetType
  className?: string
}

export const SquareImage: FC<Props> = ({
  src,
  indexSelector,
  userImageProvider,
  onError,
  loading,
  assetType,
  className,
}: Props) => {
  const { index, maxIndex, setIndex } = indexSelector ?? {}
  const { openImagePathSelector, onImagePathProvided } = userImageProvider ?? {}

  return (
    <div className={cn('w-full', className)}>
      <AspectRatio
        ratio={1}
        className={cn(
          'size-full flex items-center rounded-lg overflow-hidden select-none',
        )}
      >
        <SquareImageLoader
          assetType={assetType}
          loading={loading}
          src={src}
          onError={onError}
        />
        {userImageProvider !== undefined && (
          <SquareImagePathSelector
            openPathSelectDialog={openImagePathSelector!}
            onSelect={onImagePathProvided!}
          />
        )}
      </AspectRatio>
      {indexSelector !== undefined && (
        <SquareImageSelectFooter
          index={index!}
          setIndex={setIndex!}
          maxIndex={maxIndex!}
        />
      )}
    </div>
  )
}
