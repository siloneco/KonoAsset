import { useState } from 'react'

type Tabs = 'settings' | 'logs' | 'about'

type ReturnProps = {
  activeTab: Tabs
  setActiveTab: (tab: Tabs) => void
}

export const usePreferenceTabs = (): ReturnProps => {
  const [activeTab, setActiveTab] = useState<Tabs>('settings')

  return {
    activeTab,
    setActiveTab,
  }
}
