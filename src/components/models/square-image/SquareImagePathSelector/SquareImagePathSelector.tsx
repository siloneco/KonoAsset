import { ImagePlus } from 'lucide-react'
import { FC } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  selectUserImage: () => Promise<void>
}

export const SquareImagePathSelector: FC<Props> = ({ selectUserImage }) => {
  return (
    <div
      className="size-full group absolute top-0 left-0 cursor-pointer"
      onClick={selectUserImage}
      data-testid="square-image-path-selector"
    >
      <div className="size-full relative">
        <div className="size-full opacity-0 bg-black transition-opacity group-hover:opacity-35 dark:group-hover:opacity-50" />
        <div
          className={cn(
            'absolute top-0 left-0 size-full flex justify-center items-center',
            'opacity-0 transition-opacity group-hover:opacity-100 text-white',
          )}
        >
          <ImagePlus size={50} />
        </div>
      </div>
    </div>
  )
}
