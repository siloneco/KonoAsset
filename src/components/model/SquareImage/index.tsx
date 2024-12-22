import { AspectRatio } from '@/components/ui/aspect-ratio'
import { convertFileSrc } from '@tauri-apps/api/core'
import { ImagePlus } from 'lucide-react'
import { useImagePicker } from './hook'
import { cn } from '@/lib/utils'
import { AssetType } from '@/lib/entity'

type Props = {
  assetType: AssetType
  className?: string
  selectable?: boolean
  path?: string
  setPath?: (path: string) => void
}

const ALT = 'Asset Image'

const getDefaultImage = (assetType: AssetType) => {
  switch (assetType) {
    case AssetType.Avatar:
      return '/no-image/Avatar.png'
    case AssetType.AvatarRelated:
      return '/no-image/AvatarRelated.png'
    case AssetType.World:
      return '/no-image/World.png'
  }
}

const SquareImage = ({
  assetType,
  className,
  selectable = false,
  path,
  setPath,
}: Props) => {
  const { selectImage } = useImagePicker({ setPath })

  const fixedPath = path === undefined || path.length == 0 ? undefined : path
  const defaultImagePath = getDefaultImage(assetType)

  return (
    <AspectRatio
      ratio={1}
      className={cn(
        'w-full h-full flex items-center bg-white rounded-lg overflow-hidden',
        className,
      )}
    >
      {fixedPath !== undefined && (
        <img src={convertFileSrc(fixedPath)} alt={ALT} className="w-full" />
      )}
      {fixedPath === undefined && (
        <img src={defaultImagePath} alt={ALT} className="opacity-60 w-full" />
      )}
      {selectable && (
        <div
          className="absolute top-0 left-0 h-full w-full rounded-lg flex justify-center items-center opacity-0 bg-black text-white transition-all cursor-pointer hover:opacity-100 hover:bg-opacity-30 dark:hover:opacity-100 dark:hover:bg-opacity-50"
          onClick={selectImage}
        >
          <ImagePlus size={50} />
        </div>
      )}
    </AspectRatio>
  )
}

export default SquareImage
