import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { FC } from 'react'

type Props = {
  mainText: string
  subText?: string
  checked: boolean
  setChecked: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export const CheckboxAndLabel: FC<Props> = ({
  mainText,
  subText,
  checked,
  setChecked,
  disabled = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'ml-4 flex flex-row items-center space-x-2 cursor-pointer select-none',
        className,
      )}
      onClick={() => !disabled && setChecked(!checked)}
    >
      <Checkbox checked={checked} disabled={disabled} />
      <p>
        {mainText}
        {subText !== undefined && (
          <span className="ml-2 text-muted-foreground">({subText})</span>
        )}
      </p>
    </div>
  )
}
