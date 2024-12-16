import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import TypeSelector from '../TypeSelector'
import AvatarRelatedAssetFilter from './layout/AvatarRelatedAssetFilter'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import AddAssetModal from '../AddAssetModal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useContext } from 'react'
import { AssetFilterContext } from '@/components/context/AssetFilterContext'
import { AssetType } from '@/lib/entity'
import WorldAssetFilter from './layout/WorldAssetFilter'

const MainSidebar = () => {
  const { setTheme } = useTheme()
  const { assetType, textFilter, setTextFilter } =
    useContext(AssetFilterContext)

  function openAboutPage() {
    document.location.href = `/about`
  }

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex flex-row items-center">
          <div className="m-2 border-2 text-lg p-1 px-4 rounded-lg">
            KonoAsset
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="ml-auto mr-2 flex relative"
              >
                <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <SidebarGroup>
          <SidebarGroupContent className="p-2">
            <AddAssetModal />
            <div className="my-4">
              <Label>テキストで検索</Label>
              <Input
                placeholder="キーワードを入力..."
                className="mt-1"
                value={textFilter}
                onChange={(e) => setTextFilter(e.target.value)}
              />
            </div>
            <Label>アセットタイプ</Label>
            <TypeSelector />
            {(assetType === '' || assetType === AssetType.AvatarRelated) && (
              <AvatarRelatedAssetFilter />
            )}
            {assetType === AssetType.World && <WorldAssetFilter />}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Button className="w-full h-12 mt-auto" onClick={() => openAboutPage()}>
        このアプリについて
      </Button>
    </Sidebar>
  )
}

export default MainSidebar
