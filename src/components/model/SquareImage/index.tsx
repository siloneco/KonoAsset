import { AspectRatio } from '@/components/ui/aspect-ratio'
import { convertFileSrc } from '@tauri-apps/api/core'
import { ImagePlus } from 'lucide-react'
import { useImagePicker } from './hook'
import { cn } from '@/lib/utils'
import { AssetType, commands } from '@/lib/bindings'
import { useEffect, useState } from 'react'

type Props = {
  assetType: AssetType
  className?: string
  selectable?: boolean
  filename?: string
  setFilename?: (filename: string) => void
}

const ALT = 'Asset Image'

const getDefaultImage = (assetType: AssetType) => {
  switch (assetType) {
    case 'Avatar':
      return '/no-image/Avatar.png'
    case 'AvatarWearable':
      return '/no-image/AvatarWearable.png'
    case 'WorldObject':
      return '/no-image/WorldObject.png'
  }
}

const SquareImage = ({
  assetType,
  className,
  selectable = false,
  filename,
  setFilename,
}: Props) => {
  const { selectImage } = useImagePicker({ setFilename })
  const [fixedPath, setFixedPath] = useState<string | undefined>(undefined)

  const defaultImagePath = getDefaultImage(assetType)

  const getAbsolutePathAndSet = async () => {
    if (filename === undefined || filename.length == 0) {
      return
    }

    const absolutePath = await commands.getImageAbsolutePath(filename)
    if (absolutePath.status === 'ok') {
      setFixedPath(absolutePath.data)
    } else {
      console.error(absolutePath.error)
    }
  }

  useEffect(() => {
    getAbsolutePathAndSet()
  }, [filename])

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
