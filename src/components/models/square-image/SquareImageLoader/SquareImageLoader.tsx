import { Skeleton } from '@/components/ui/skeleton'
import { AssetType } from '@/lib/bindings'
import { FC } from 'react'
import { ALT, DEFAULT_IMAGE_PATH } from './SquareImageLoader.constants'

type Props = {
  src?: string
  loading: boolean
  assetType: AssetType
  onError?: () => void
}

export const SquareImageLoader: FC<Props> = ({
  src,
  loading,
  assetType,
  onError,
}) => {
  const defaultImagePath = DEFAULT_IMAGE_PATH[assetType]

  if (loading) {
    return <Skeleton className="size-full rounded-none" />
  }

  if (src !== undefined) {
    return (
      <div className="bg-white size-full flex items-center">
        <img src={src} alt={ALT} onError={onError} className="w-full" />
      </div>
    )
  }

  return (
    <div className="w-full bg-white">
      <img src={defaultImagePath} alt={ALT} className="size-full opacity-60" />
    </div>
  )
}
