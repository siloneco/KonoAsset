import { cn } from '@/lib/utils'
import { ReactNode } from '@tanstack/react-router'
import { ChevronsRight } from 'lucide-react'
import { FC } from 'react'

type BaseProps = {
  active: boolean
  onClick: () => void
  children: ReactNode
}

export const ExportTypeButton: FC<BaseProps> = ({
  active,
  onClick,
  children,
}) => (
  <div
    className={cn(
      'border border-muted-foreground/40 rounded-lg p-2 cursor-pointer transition-colors',
      active && 'border-primary',
    )}
    onClick={onClick}
  >
    {children}
  </div>
)

type TitleProps = {
  children: ReactNode
}

export const ExportTypeButtonTitle: FC<TitleProps> = ({ children }) => (
  <div className="flex flex-row">
    <ChevronsRight className="text-foreground/50 mr-2" />
    {children}
  </div>
)

type DescriptionProps = {
  children: ReactNode
}

export const ExportTypeButtonDescription: FC<DescriptionProps> = ({
  children,
}) => <div className="text-sm text-muted-foreground ml-8">{children}</div>
