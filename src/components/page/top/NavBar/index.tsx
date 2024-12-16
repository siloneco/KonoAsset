import { AssetFilterContext } from '@/components/context/AssetFilterContext'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AssetType } from '@/lib/entity'
import { useContext } from 'react'

const NavBar = () => {
  const { assetType, textFilter } = useContext(AssetFilterContext)

  let assetTypeDisplay

  if (assetType === AssetType.Avatar) {
    assetTypeDisplay = 'アバター'
  } else if (assetType === AssetType.AvatarRelated) {
    assetTypeDisplay = 'アバター関連'
  } else if (assetType === AssetType.World) {
    assetTypeDisplay = 'ワールド'
  }

  return (
    <div className="m-4">
      <div className="flex flex-row w-full">
        <div className="w-full">
          <Card className="p-3 pl-4 h-12 flex flex-row">
            {assetType !== '' && (
              <div className="">
                <span className="text-foreground/70">タイプ: </span>
                <span className="bg-primary text-primary-foreground px-2 rounded-lg">
                  {assetTypeDisplay}
                </span>
              </div>
            )}
            {textFilter !== '' && (
              <div>
                <span className="text-foreground/70">文字検索: </span>
                <span className="bg-primary text-primary-foreground px-2 rounded-lg">
                  {textFilter}
                </span>
              </div>
            )}
          </Card>
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
