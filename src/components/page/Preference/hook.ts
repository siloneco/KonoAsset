import { useState } from 'react'

export type PreferenceTabIDs =
  | 'settings'
  | 'adapter'
  | 'logs'
  | 'about'
  | 'statistics'

type ReturnProps = {
  activeTab: PreferenceTabIDs
  setActiveTab: (tab: PreferenceTabIDs) => void
}

export const usePreferencePage = (): ReturnProps => {
  const [activeTab, setActiveTab] = useState<PreferenceTabIDs>('settings')

  return {
    activeTab,
    setActiveTab,
  }
}
