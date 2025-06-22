import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronsRight } from 'lucide-react'

type Props = {
  text: string
  onClick: () => void
  selected: boolean
}

export const SelectTypeButton = ({ text, onClick, selected }: Props) => {
  return (
    <Button
      onClick={onClick}
      variant={'outline'}
      className={cn(
        'w-96 h-12 py-1',
        selected &&
          'border-2 border-ring dark:border-ring ring-ring/50 ring-[3px]',
      )}
    >
      <div className="w-3">
        {selected && <ChevronsRight className="text-primary" size={32} />}
      </div>
      {text}
    </Button>
  )
}
