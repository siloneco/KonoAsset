import { FC } from 'react'
import { ButtonWithCheckMark } from '../ButtonWithCheckMark'
import { Label } from '@/components/ui/label'
import { Proportions } from 'lucide-react'

type Props = {
  current: string
  setValue: (value: string) => void
}

export const SizeSelector: FC<Props> = ({ current, setValue }) => {
  return (
    <div>
      <Label className="px-4 py-2 flex flex-row items-center text-base">
        <Proportions className="text-muted-foreground mr-2" size={20} />
        表示サイズ
      </Label>
      <ButtonWithCheckMark value="Large" setter={setValue} current={current}>
        大
      </ButtonWithCheckMark>
      <ButtonWithCheckMark value="Medium" setter={setValue} current={current}>
        中
      </ButtonWithCheckMark>
      <ButtonWithCheckMark value="Small" setter={setValue} current={current}>
        小
      </ButtonWithCheckMark>
      <ButtonWithCheckMark value="List" setter={setValue} current={current}>
        リスト
      </ButtonWithCheckMark>
    </div>
  )
}
