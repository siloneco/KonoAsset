import { AssetContext } from '@/components/context/AssetContext'
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
import { AssetType, SortBy } from '@/lib/entity'
import { useContext } from 'react'

const NavBar = () => {
  const {
    assetType,
    textFilter,
    categoryFilter,
    supportedAvatarFilter,
    tagFilter,
  } = useContext(AssetFilterContext)
  const { setSortBy, setReverseOrder } = useContext(AssetContext)

  let assetTypeDisplay

  if (assetType === AssetType.Avatar) {
    assetTypeDisplay = 'アバター'
  } else if (assetType === AssetType.AvatarRelated) {
    assetTypeDisplay = 'アバター関連'
  } else if (assetType === AssetType.World) {
    assetTypeDisplay = 'ワールド'
  }

  const handleSortByChange = (value: string) => {
    switch (value) {
      case 'created_at_desc':
        setSortBy(SortBy.CreatedAt)
        setReverseOrder(true)
        break
      case 'created_at_asc':
        setSortBy(SortBy.CreatedAt)
        setReverseOrder(false)
        break
      case 'title_asc':
        setSortBy(SortBy.Title)
        setReverseOrder(false)
        break
      case 'title_desc':
        setSortBy(SortBy.Title)
        setReverseOrder(true)
        break
      case 'author_asc':
        setSortBy(SortBy.Author)
        setReverseOrder(false)
        break
      case 'author_desc':
        setSortBy(SortBy.Author)
        setReverseOrder(true)
        break
      case 'published_at_desc':
        setSortBy(SortBy.PublishedAt)
        setReverseOrder(true)
        break
      case 'published_at_asc':
        setSortBy(SortBy.PublishedAt)
        setReverseOrder(false)
        break
    }
  }

  return (
    <div className="m-4">
      <div className="flex flex-row w-full">
        <div className="w-full">
          <Card className="p-3 pl-4 min-h-12 grid grid-cols-2 xl:grid-cols-4">
            {assetType !== 'all' && (
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
            {categoryFilter.length > 0 && (
              <div>
                <span className="text-foreground/70">カテゴリ: </span>
                <span className="bg-primary text-primary-foreground px-2 rounded-lg">
                  {categoryFilter.length}件
                </span>
              </div>
            )}
            {supportedAvatarFilter.length > 0 && (
              <div>
                <span className="text-foreground/70">対応アバター: </span>
                <span className="bg-primary text-primary-foreground px-2 rounded-lg">
                  {supportedAvatarFilter.length}件
                </span>
              </div>
            )}
            {tagFilter.length > 0 && (
              <div>
                <span className="text-foreground/70">タグ: </span>
                <span className="bg-primary text-primary-foreground px-2 rounded-lg">
                  {tagFilter.length}件
                </span>
              </div>
            )}
          </Card>
        </div>
        <div className="w-fit mx-2 flex items-center">
          <Select
            onValueChange={handleSortByChange}
            defaultValue="created_at_desc"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ソート設定" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="created_at_desc">
                  追加順 (新しいものから)
                </SelectItem>
                <SelectItem value="created_at_asc">
                  追加順 (古いものから)
                </SelectItem>
                <SelectItem value="title_asc">アセット名 (A-Z順)</SelectItem>
                <SelectItem value="title_desc">アセット名 (Z-A順)</SelectItem>
                <SelectItem value="author_asc">ショップ名 (A-Z順)</SelectItem>
                <SelectItem value="author_desc">ショップ名 (Z-A順)</SelectItem>
                <SelectItem value="published_at_desc">
                  商品公開日 (新しいものから)
                </SelectItem>
                <SelectItem value="published_at_asc">
                  商品公開日 (古いものから)
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default NavBar
