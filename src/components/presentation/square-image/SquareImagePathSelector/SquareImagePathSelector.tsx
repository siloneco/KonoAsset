import { ImagePlus } from 'lucide-react'
import { FC } from 'react'
import { useSquareImagePathSelector } from './hook'
import { cn } from '@/lib/utils'

type Props = {
  openPathSelectDialog: () => Promise<string | null>
  onSelect: (path: string) => void
}

export const SquareImagePathSelector: FC<Props> = ({
  openPathSelectDialog,
  onSelect,
}) => {
  const { onClick } = useSquareImagePathSelector({
    openPathSelectDialog,
    onSelect,
  })

  return (
    <div
      className={cn(
        'absolute top-0 left-0 size-full flex justify-center items-center',
        'opacity-0 bg-black text-white transition-all cursor-pointer hover:opacity-35 dark:hover:opacity-50',
      )}
      onClick={onClick}
    >
      <ImagePlus size={50} />
    </div>
  )
}
