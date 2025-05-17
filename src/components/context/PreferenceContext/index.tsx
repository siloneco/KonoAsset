import { createContext, FC } from 'react'
import { usePreferenceContext } from './hook'
import { PreferenceStore } from '@/lib/bindings'
import { useTheme } from 'next-themes'
import { getDefaultPreferences } from '@/lib/utils'

export type PreferenceContextType = {
  preference: PreferenceStore
  setPreference: (preference: PreferenceStore, save: boolean) => Promise<void>
}

export const PreferenceContext = createContext<PreferenceContextType>({
  preference: getDefaultPreferences(),
  setPreference: async () => {},
})

type Props = {
  children: React.ReactNode
}

export const PreferenceContextProvider: FC<Props> = ({ children }) => {
  const { preferenceContextValue } = usePreferenceContext()
  const { setTheme } = useTheme()

  setTheme(preferenceContextValue.preference.theme)

  return (
    <PreferenceContext.Provider value={preferenceContextValue}>
      {children}
    </PreferenceContext.Provider>
  )
}
