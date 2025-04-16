import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Home, Import, Info, Logs, Settings } from 'lucide-react'
import { PreferenceTabIDs } from '../../../hook'
import { FC } from 'react'
import { usePreferenceSidebar } from './hook'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  activeTab: PreferenceTabIDs
  setActiveTab: (tab: PreferenceTabIDs) => void
}

export const PreferenceSidebar: FC<Props> = ({ activeTab, setActiveTab }) => {
  const { t } = useLocalization()
  const { version, backToTopPage, onVersionClick } = usePreferenceSidebar()

  return (
    <Sidebar collapsible="none" className="h-screen w-64 border-r-2 py-4">
      <SidebarHeader className="w-64">
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
            <PreferenceSidebarButton
              id="settings"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              <Settings />
              {t('preference:settings')}
            </PreferenceSidebarButton>
          </SidebarGroupContent>
          <SidebarGroupContent className="p-2">
            <PreferenceSidebarButton
              id="adapter"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              <Import />
              {t('preference:adapter')}
            </PreferenceSidebarButton>
          </SidebarGroupContent>
          <SidebarGroupContent className="p-2">
            <PreferenceSidebarButton
              id="logs"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              <Logs />
              {t('preference:logs')}
            </PreferenceSidebarButton>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="p-2">
          <PreferenceSidebarButton
            id="about"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          >
            <Info />
            {t('preference:about')}
          </PreferenceSidebarButton>
        </div>
        <div
          className="flex justify-center text-muted-foreground select-none cursor-pointer"
          onClick={onVersionClick}
        >
          KonoAsset v{version}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

type SidebarButtonProps = {
  id: PreferenceTabIDs
  activeTab: PreferenceTabIDs
  setActiveTab: (tab: PreferenceTabIDs) => void
  children: React.ReactNode
}

const PreferenceSidebarButton: FC<SidebarButtonProps> = ({
  id,
  activeTab,
  setActiveTab,
  children,
}) => {
  return (
    <Button
      className="w-full rounded-full"
      variant={activeTab === id ? 'default' : 'secondary'}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </Button>
  )
}
