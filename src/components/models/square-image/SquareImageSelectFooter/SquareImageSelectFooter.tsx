import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FC } from 'react'

type Props = {
  index: number
  setIndex: (index: number) => void
  maxIndex: number
}

export const SquareImageSelectFooter: FC<Props> = ({
  index,
  setIndex,
  maxIndex,
}) => {
  return (
    <div className="w-32 flex justify-between mx-auto mt-2">
      <Button
        variant="outline"
        className="h-8 w-4"
        type="button"
        disabled={index <= 0}
        onClick={() => setIndex(index - 1)}
      >
        <ChevronLeft size={16} />
      </Button>
      <p className="text-muted-foreground flex items-center">
        {maxIndex >= 0 && `${index + 1}/${maxIndex + 1}`}
        {maxIndex < 0 && `---`}
      </p>
      <Button
        variant="outline"
        className="h-8 w-4"
        type="button"
        disabled={maxIndex <= 0 || index === maxIndex}
        onClick={() => setIndex(index + 1)}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  )
}
