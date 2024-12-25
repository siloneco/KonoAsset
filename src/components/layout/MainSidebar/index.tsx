import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'

import TypeSelector from '../../model/TypeSelector'
import AvatarRelatedAssetFilter from './layout/AvatarRelatedAssetFilter'
import { Button } from '@/components/ui/button'
import { Moon, Sun, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useContext, useEffect, useRef, useState } from 'react'
import { AssetType } from '@/lib/entity'
import WorldAssetFilter from './layout/WorldAssetFilter'
import MultiFilterItemSelector from '@/components/model/MultiFilterItemSelector'
import { Option } from '@/components/ui/multi-select'
import { fetchAllTags } from './logic'
import { PersistentContext } from '@/components/context/PersistentContext'
import { ScrollArea } from '@/components/ui/scroll-area'

const MainSidebar = () => {
  const { setTheme } = useTheme()
  const {
    assetType,
    textFilter,
    setTextFilter,
    tagFilter,
    setTagFilter,
    tagFilterMatchType,
    setTagFilterMatchType,
  } = useContext(PersistentContext)

  const [tagCandidates, setTagCandidates] = useState<Option[]>([])
  const tagValues: Option[] = tagFilter.map((tag) => ({
    value: tag,
    label: tag,
  }))

  const updateCategoriesAndTags = async () => {
    setTagCandidates(await fetchAllTags())
  }

  useEffect(() => {
    updateCategoriesAndTags()
  }, [])

  const onClick = () => {
    setTheme?.((theme) => (theme === 'dark' ? 'light' : 'dark'))
  }

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'f' && inputRef.current) {
        inputRef.current.focus()
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Sidebar collapsible="none" className="w-80 border-r-2">
      <SidebarContent>
        <ScrollArea className="h-screen">
          <div className="flex flex-row items-center">
            <div className="m-2 border-2 text-lg p-1 px-4 rounded-lg">
              KonoAsset
            </div>
            <Button
              variant="outline"
              size="icon"
              className="ml-auto mr-2 flex relative"
              onClick={onClick}
            >
              <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          <SidebarGroup>
            <SidebarGroupContent className="p-2">
              <div className="mb-4">
                <Label>テキストで検索</Label>
                <div className="relative w-full max-w-sm">
                  <Input
                    placeholder="キーワードを入力..."
                    className="mt-1"
                    value={textFilter}
                    onChange={(e) => setTextFilter(e.target.value)}
                    ref={inputRef}
                  />
                  {textFilter && (
                    <X
                      size={24}
                      className="absolute right-1 top-1/2 -translate-y-1/2 mr-2 cursor-pointer"
                      onClick={() => {
                        setTextFilter('')
                      }}
                    />
                  )}
                </div>
              </div>
              <Label>アセットタイプ</Label>
              <TypeSelector />
              {(assetType === 'all' ||
                assetType === AssetType.AvatarRelated) && (
                <AvatarRelatedAssetFilter />
              )}
              {assetType === AssetType.World && <WorldAssetFilter />}
              <div className="mt-4">
                <MultiFilterItemSelector
                  label="タグ"
                  placeholder="絞り込むタグを選択..."
                  candidates={tagCandidates}
                  value={tagValues}
                  onValueChange={(values) =>
                    setTagFilter(values.map((v) => v.value))
                  }
                  matchType={tagFilterMatchType}
                  setMatchType={setTagFilterMatchType}
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}

export default MainSidebar
