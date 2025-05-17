import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ChevronRight, File } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  onClick: () => void
}

export const SelectFileCard = ({ onClick }: Props) => {
  const { t } = useLocalization()
  return (
    <Card className="w-[250px]">
      <CardContent>
        <div className="m-8 mb-2">
          <File
            size={80}
            className="block mx-auto text-muted-foreground dark:text-foreground"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="mx-auto" onClick={onClick}>
          <ChevronRight size={24} />
          {t('addasset:select-file')}
        </Button>
      </CardFooter>
    </Card>
  )
}
