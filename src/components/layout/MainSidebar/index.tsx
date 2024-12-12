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
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  AssetImportRequest,
  AssetImportResult,
  PreAvatarAsset,
} from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'
import { useToast } from '@/hooks/use-toast'
import { open } from '@tauri-apps/plugin-dialog'
const examplePreAsset: PreAvatarAsset = {
  description: {
    title: '『シフォン』-Chiffon-【オリジナル3Dモデル】',
    author: 'あまとうさぎ',
    image_src:
      'https://booth.pximg.net/61a3b2d7-b4b1-4f97-9e48-ffe959b26ae9/i/5354471/c42b543c-a334-4f18-bd26-a5cf23e2a61b_base_resized.jpg',
    tags: [],
    created_at: '2024-12-11T00:00:00Z',
  },
}

const MainSidebar = () => {
  const { setTheme } = useTheme()
  const { toast } = useToast()

  const sendCreateAssetRequest = async (path: string) => {
    const request: AssetImportRequest = {
      pre_asset: examplePreAsset,
      file_or_dir_absolute_path: path,
    }

    const result: AssetImportResult = await invoke(
      'request_avatar_asset_import',
      {
        request,
      },
    )

    if (result.success) {
      toast({
        title: 'データのインポートが完了しました！',
        description: result.asset?.description.title,
      })

      return
    }

    toast({
      title: 'データのインポートに失敗しました',
      description: result.error_message,
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
              className="w-full"
              onClick={async () => {
                const path = await open({ multiple: false, directory: true })

                if (path !== null) {
                  console.log(path)
                  await sendCreateAssetRequest(path)
                }
              }}
            >
              アセット追加 (Dir)
            </Button>
            <Button
              className="w-full"
              onClick={async () => {
                const path = await open({ multiple: false })

                if (path !== null) {
                  console.log(path)
                  await sendCreateAssetRequest(path)
                }
              }}
            >
              アセット追加 (File)
            </Button>

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
