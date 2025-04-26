import { RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

type Props = {
  id: string
  value: string
  text: string
}

const TypeSelectorRadioItem = ({ id, value, text }: Props) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="text-base cursor-pointer">
        {text}
      </Label>
    </div>
  )
}

export default TypeSelectorRadioItem
