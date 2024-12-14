import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronsRight } from 'lucide-react'

type Props = {
  text: string
  onClick: () => void
  selected: boolean
}

const SelectTypeButton = ({ text, onClick, selected }: Props) => {
  return (
    <Button
      onClick={onClick}
      variant={'outline'}
      className={cn('w-96 h-12 py-1', selected && 'border-primary border-2')}
    >
      <div className="w-3">
        {selected && <ChevronsRight className="text-primary" size={32} />}
      </div>
      {text}
    </Button>
  )
}

export default SelectTypeButton
