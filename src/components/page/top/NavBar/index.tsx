import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = {}

const NavBar = ({}: Props) => {
  return (
    <div className="m-4">
      <div className="flex flex-row w-full">
        <div className="flex flex-row text-center items-center pl-4 space-x-6 rounded-lg w-full bg-red-100 dark:bg-red-200">
          <Label className="text-base dark:text-black">
            <span className="text-gray-700/50">タイプ: </span>
            アバター関連アセット
          </Label>
          <Label className="text-base dark:text-black">
            <span className="text-gray-700/50">対応アバター: </span>マヌカ,
            セレスティア
          </Label>
        </div>
        <div className="w-fit mx-2 flex items-center">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ソート設定" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">追加順(新しいものから)</SelectItem>
                <SelectItem value="banana">追加順(古いものから)</SelectItem>
                <SelectItem value="blueberry">カテゴリ名</SelectItem>
                <SelectItem value="grapes">タイトル(A-Z順)</SelectItem>
                <SelectItem value="pineapple">タイトル(Z-A順)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default NavBar
