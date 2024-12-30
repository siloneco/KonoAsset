import { Tabs } from '@/components/ui/tabs'
import { FC } from 'react'
import SettingsTab from './tabs/SettingsTab'
import LogsTab from './tabs/LogsTab'
import AboutTab from './tabs/AboutTab'

type Props = {
  activeTab: string
}

const PreferenceTabs: FC<Props> = ({ activeTab }) => {
  return (
    <Tabs defaultValue="settings" value={activeTab} className="w-full h-full">
      <SettingsTab id="settings" />
      <LogsTab id="logs" />
      <AboutTab id="about" />
    </Tabs>
  )
}

export default PreferenceTabs
