import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ChevronRight, File } from 'lucide-react'

type Props = {
  onClick: () => void
}

const SelectFileCard = ({ onClick }: Props) => {
  return (
    <Card className="w-[250px]">
      <CardContent>
        <div className="m-8 mb-2">
          <File size={80} className="block mx-auto" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="mx-auto" onClick={onClick}>
          <ChevronRight size={24} />
          ファイルを選択する
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SelectFileCard
