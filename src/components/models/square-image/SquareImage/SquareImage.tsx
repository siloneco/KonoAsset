import { FC } from 'react'
import { InternalSquareImage } from './internal'
import { AssetType } from '@/lib/bindings'
import { useSquareImage } from './hook'

type Props = {
  filename?: string
  imageUrls?: string[]
  userImageSelectable?: boolean
  assetType: AssetType
  className?: string
}

export const SquareImage: FC<Props> = ({
  filename,
  imageUrls,
  userImageSelectable = false,
  assetType,
  className,
}) => {
  const { src, loading, indexSelector, selectUserImage, onError } =
    useSquareImage({
      filename,
      imageUrls,
      userImageSelectable,
    })

  return (
    <InternalSquareImage
      src={src}
      loading={loading}
      indexSelector={indexSelector}
      selectUserImage={selectUserImage}
      onError={onError}
      assetType={assetType}
      className={className}
    />
  )
}
