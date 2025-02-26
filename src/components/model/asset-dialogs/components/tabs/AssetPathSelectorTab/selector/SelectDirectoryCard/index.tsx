import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ChevronRight, Folder } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  onClick: () => void
}

const SelectDirectoryCard = ({ onClick }: Props) => {
  const { t } = useLocalization()
  return (
    <Card className="w-[250px]">
      <CardContent>
        <div className="m-8 mb-2">
          <Folder
            size={80}
            className="block mx-auto text-yellow-600 dark:text-foreground"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="mx-auto" onClick={onClick}>
          <ChevronRight size={24} />
          {t('addasset:select-directory')}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SelectDirectoryCard
