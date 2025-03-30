import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { FC } from 'react'

type Props = {
  children: string
  value: string
  setter: (value: string) => void
  current: string
}

export const ButtonWithCheckMark: FC<Props> = ({
  children,
  value,
  setter,
  current,
}) => {
  return (
    <Button
      variant="ghost"
      className="flex w-full justify-start h-8 font-normal"
      onClick={() => setter(value)}
    >
      <Check className={cn(value !== current && 'opacity-0')} />
      {children}
    </Button>
  )
}
