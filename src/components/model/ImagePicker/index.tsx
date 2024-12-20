import { AspectRatio } from '@/components/ui/aspect-ratio'
import { convertFileSrc } from '@tauri-apps/api/core'
import { ImagePlus } from 'lucide-react'
import { useImagePicker } from './hook'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  path?: string
  setPath: (path: string) => void
}

const ALT = 'Asset Image'

const ImagePicker = ({ className, path, setPath }: Props) => {
  const { selectImage } = useImagePicker({ setPath })

  return (
    <AspectRatio
      ratio={1}
      className={cn(
        'w-full h-full flex items-center bg-white rounded-lg overflow-hidden',
        className,
      )}
    >
      {path !== undefined && <img src={convertFileSrc(path)} alt={ALT} />}
      {path === undefined && <div className="w-full h-full bg-slate-400" />}
      <div
        className="absolute top-0 left-0 h-full w-full rounded-lg flex justify-center items-center opacity-0 bg-black text-white transition-all cursor-pointer hover:opacity-100 hover:bg-opacity-30 dark:hover:opacity-100 dark:hover:bg-opacity-50"
        onClick={selectImage}
      >
        <ImagePlus size={50} />
      </div>
    </AspectRatio>
  )
}

export default ImagePicker
