import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ChevronRight, Folder } from 'lucide-react'

type Props = {
  onClick: () => void
}

const SelectDirectoryCard = ({ onClick }: Props) => {
  return (
    <Card className="w-[250px]">
      <CardContent>
        <div className="m-8 mb-2">
          <Folder size={80} className="block mx-auto" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="mx-auto" onClick={onClick}>
          <ChevronRight size={24} />
          フォルダを選択する
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SelectDirectoryCard
