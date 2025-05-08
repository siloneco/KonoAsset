import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Props = {
  title: string
  number: number
  unit?: string
  className?: string
}

export const NumberDisplay: React.FC<Props> = ({
  title,
  number,
  unit,
  className,
}) => {
  return (
    <Card className={cn('h-full w-full', className)}>
      <CardHeader>
        <p className="truncate">{title}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-center">
          <p className="text-5xl font-bold mr-1">{number}</p>
          {unit && (
            <p className="text-lg font-bold text-muted-foreground self-end">
              {unit}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
