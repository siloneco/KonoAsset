import { useState } from 'react'

export type PreferenceTabIDs =
  | 'settings'
  | 'adapter'
  | 'statistics'
  | 'logs'
  | 'about'

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
