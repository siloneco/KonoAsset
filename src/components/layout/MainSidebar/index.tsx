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
import AddAssetModal from '../AddAssetModal'

const MainSidebar = () => {
  const { setTheme } = useTheme()

  function openAboutPage() {
    document.location.href = `/about`
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
            <AddAssetModal />
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
      <Button className="w-full h-12 mt-auto" onClick={() => openAboutPage()}>
        このアプリについて
      </Button>
    </Sidebar>
  )
}

export default MainSidebar
