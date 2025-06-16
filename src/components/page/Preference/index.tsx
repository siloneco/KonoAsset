import { SidebarProvider } from '@/components/ui/sidebar'
import { PreferenceTabs } from './components/model/PreferenceTabs'
import { usePreferencePage } from './hook'
import { PreferenceSidebar } from './components/model/PreferenceSidebar'

export const PreferencePage = () => {
  const { activeTab, setActiveTab } = usePreferencePage()

  return (
    <div className="h-screen w-screen flex flex-row selection:bg-primary selection:text-primary-foreground [view-transition-name:main-content]">
      <SidebarProvider>
        <PreferenceSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <PreferenceTabs activeTab={activeTab} />
      </SidebarProvider>
    </div>
  )
}
