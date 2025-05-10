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
        <p className="truncate font-bold">{title}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-row items-center justify-center">
          <p className="text-2xl lg:text-4xl xl:text-5xl font-bold whitespace-nowrap">
            {number.toLocaleString()}
          </p>
          {unit && (
            <div className="hidden xl:flex self-end ml-1">
              <p className="text-sm font-bold text-muted-foreground">{unit}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
