import { AssetSummary, AssetType, Result } from '@/lib/bindings'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  asset: AssetSummary
  getAssetDirectoryPath: (assetId: string) => Promise<Result<string, string>>
  setFilterAssetType: (assetType: AssetType) => void
  setCreatorNameFilter: (creatorName: string) => void
  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
}

type ReturnProps = {
  imageSrc: string | undefined
  imageLoading: boolean
  onAssetTypeBadgeClick: () => void
  onShopNameClick: () => void
  onCopyPathButtonClick: () => Promise<void>
}

export const useAssetCard = ({
  asset,
  getAssetDirectoryPath,
  setFilterAssetType,
  setCreatorNameFilter,
  resolveImageAbsolutePath,
}: Props): ReturnProps => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined)
  const [imageLoading, setImageLoading] = useState(false)

  useEffect(() => {
    let ignore = false
    if (asset.imageFilename === null) return

    setImageLoading(true)

    resolveImageAbsolutePath(asset.imageFilename)
      .then((result) => {
        if (ignore) return
        if (result.status === 'ok') setImageSrc(result.data)
        else setImageSrc(undefined)
      })
      .finally(() => {
        if (ignore) return
        setImageLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [asset.imageFilename, resolveImageAbsolutePath])

  const onAssetTypeBadgeClick = useCallback(() => {
    setFilterAssetType(asset.assetType)
  }, [asset.assetType, setFilterAssetType])

  const onShopNameClick = useCallback(() => {
    setCreatorNameFilter(asset.creator)
  }, [asset.creator, setCreatorNameFilter])

  const onCopyPathButtonClick = useCallback(async () => {
    const result = await getAssetDirectoryPath(asset.id)
    if (result.status === 'ok') {
      navigator.clipboard.writeText(result.data)
    }
  }, [asset.id, getAssetDirectoryPath])

  return {
    imageSrc,
    imageLoading,
    onAssetTypeBadgeClick,
    onShopNameClick,
    onCopyPathButtonClick,
  }
}
