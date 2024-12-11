import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import TypeSelector from '../TypeSelector'
import AvatarAssetNarrowing from '../AvatarAssetNarrowing'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Moon, Plus, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { AvatarAsset, PreAvatarAsset } from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'
import { useToast } from '@/hooks/use-toast'

type Props = {}

const examplePreAsset: PreAvatarAsset = {
  description: {
    title: 'オリジナル3Dモデル「しなの」',
    author: 'ポンデロニウム研究所',
    image_src:
      'https://booth.pximg.net/ed52788c-0b3b-4e38-9ded-1e5797daf0ef/i/6106863/07bd77df-a8ee-4244-8c4e-16cf7cb584bb_base_resized.jpg',
    asset_dirs: [],
    tags: [],
    created_at: '2024-12-11T00:00:00Z',
  },
}

const MainSidebar = ({}: Props) => {
  const { setTheme } = useTheme()
  const { toast } = useToast()

  const sendCreateAssetRequest = async () => {
    const result: AvatarAsset = await invoke('create_avatar_asset', {
      preAvatarAsset: examplePreAsset,
    })
    console.log(result)

    toast({
      title: 'データを1つ追加しました！',
      description: '「しなの」のサンプルデータを追加しました',
    })
  }

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex flex-row items-center">
          <div className="m-2 border-2 text-lg">VRC Asset Manager</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="ml-auto mr-2">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
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
            <Button
              className="w-full h-12 mb-6"
              onClick={() => sendCreateAssetRequest()}
            >
              <Plus size={24} />
              アセット追加
            </Button>
            <Label>テキスト検索</Label>
            <Input placeholder="テキストを入力..." className="mt-2" />
            <Accordion
              type="multiple"
              className="w-full"
              defaultValue={['type-selector']}
            >
              <AccordionItem value="type-selector">
                <AccordionTrigger>タイプ選択</AccordionTrigger>
                <AccordionContent>
                  <TypeSelector />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="narrowing">
                <AccordionTrigger>詳細な絞り込み</AccordionTrigger>
                <AccordionContent>
                  <AvatarAssetNarrowing />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default MainSidebar
