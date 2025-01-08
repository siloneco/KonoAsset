import { Tabs } from '@/components/ui/tabs'
import { FC } from 'react'
import SettingsTab from './tabs/SettingsTab'
import LogsTab from './tabs/LogsTab'
import AboutTab from './tabs/AboutTab'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {
  activeTab: string
}

const PreferenceTabs: FC<Props> = ({ activeTab }) => {
  return (
    <Tabs defaultValue="settings" value={activeTab} className="w-full">
      <ScrollArea>
        <SettingsTab id="settings" />
        <LogsTab id="logs" />
        <AboutTab id="about" />
      </ScrollArea>
    </Tabs>
  )
}

export default PreferenceTabs
