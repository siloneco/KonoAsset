import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
  checked: boolean
  setChecked: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export const ResetDialogCheckbox: FC<Props> = ({
  children,
  checked,
  setChecked,
  disabled = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center space-x-2 cursor-pointer select-none',
        className,
      )}
      onClick={() => !disabled && setChecked(!checked)}
    >
      <Checkbox checked={checked} disabled={disabled} />
      <div>{children}</div>
    </div>
  )
}
