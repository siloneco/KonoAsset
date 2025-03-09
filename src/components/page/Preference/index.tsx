import { SidebarProvider } from '@/components/ui/sidebar'
import PreferenceTabs from './components/model/PreferenceTabs'
import { usePreferencePage } from './hook'
import { PreferenceSidebar } from './components/model/PreferenceSidebar'

const PreferencePage = () => {
  const { activeTab, setActiveTab } = usePreferencePage()

  return (
    <div className="h-screen w-screen flex flex-row">
      <SidebarProvider>
        <PreferenceSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <PreferenceTabs activeTab={activeTab} />
      </SidebarProvider>
    </div>
  )
}

export default PreferencePage
