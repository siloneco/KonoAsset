import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'

import TypeSelector from './components/TypeSelector'
import AvatarWearableFilter from './layout/AvatarWearableFilter'
import { Button } from '@/components/ui/button'
import { Settings, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useContext, useEffect, useRef, useState } from 'react'
import WorldObjectFilter from './layout/WorldObjectFilter'
import MultiFilterItemSelector from '@/components/model/MainSidebar/components/MultiFilterItemSelector'
import { Option } from '@/components/ui/multi-select'
import { fetchAllTags } from './logic'
import { PersistentContext } from '@/components/context/PersistentContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNavigate } from '@tanstack/react-router'
import { Route as PreferenceRoute } from '@/routes/preference'

const MainSidebar = () => {
  const navigate = useNavigate()
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
          <div className="flex flex-row items-center m-4 mr-0">
            <img src="/logo.png" alt="logo" className="w-10 h-10" />
            <div className="text-xl ml-2">KonoAsset</div>
            <Button
              variant="outline"
              size="icon"
              className="ml-auto mr-2 flex relative"
              onClick={() => navigate({ to: PreferenceRoute.to })}
            >
              <Settings />
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
              {(assetType === 'All' || assetType === 'AvatarWearable') && (
                <AvatarWearableFilter />
              )}
              {assetType === 'WorldObject' && <WorldObjectFilter />}
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
