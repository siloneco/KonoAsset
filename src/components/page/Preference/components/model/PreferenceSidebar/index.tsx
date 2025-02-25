import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Home, Info, Logs, Settings } from 'lucide-react'
import { PreferenceTabIDs } from '../../../hook'
import { FC } from 'react'
import { usePreferenceSidebar } from './hook'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  activeTab: PreferenceTabIDs
  setActiveTab: (tab: PreferenceTabIDs) => void
}

const PreferenceSidebar: FC<Props> = ({ activeTab, setActiveTab }) => {
  const { t } = useLocalization()
  const { version, backToTopPage, onVersionClick } = usePreferenceSidebar()

  return (
    <Sidebar collapsible="none" className="h-screen w-80 border-r-2 py-4">
      <SidebarHeader>
        <Button
          className="w-full rounded-full"
          variant="ghost"
          onClick={backToTopPage}
        >
          <ChevronLeft />
          <Home />
          {t('preference:back-to-top')}
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="p-2">
            <Button
              className="w-full rounded-full"
              variant={activeTab === 'settings' ? 'default' : 'secondary'}
              onClick={() => setActiveTab('settings')}
            >
              <Settings />
              {t('preference:settings')}
            </Button>
          </SidebarGroupContent>
          <SidebarGroupContent className="p-2">
            <Button
              className="w-full rounded-full"
              variant={activeTab === 'logs' ? 'default' : 'secondary'}
              onClick={() => setActiveTab('logs')}
            >
              <Logs />
              {t('preference:logs')}
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="p-2">
          <Button
            className="w-full rounded-full"
            variant={activeTab === 'about' ? 'default' : 'secondary'}
            onClick={() => setActiveTab('about')}
          >
            <Info />
            {t('preference:about')}
          </Button>
        </div>
        <div
          className="flex justify-center text-foreground/60 select-none cursor-pointer"
          onClick={onVersionClick}
        >
          KonoAsset v{version}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default PreferenceSidebar
