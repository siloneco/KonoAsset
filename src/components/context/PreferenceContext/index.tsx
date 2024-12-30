import { createContext, FC } from 'react'
import { usePreferenceContext } from './hook'
import { PreferenceStore } from '@/lib/bindings'
import { useTheme } from 'next-themes'

export type PreferenceContextType = {
  preference: PreferenceStore
  setPreference: (preference: PreferenceStore, save: boolean) => Promise<void>
}

export const PreferenceContext = createContext<PreferenceContextType>({
  preference: {
    dataDirPath: '',
    theme: 'system',
    skipConfirmation: {
      deleteFileOrDirOnImport: false,
      openManagedDirOnMultipleUnitypackageFound: false,
    },
  },
  setPreference: async () => {},
})

type Props = {
  children: React.ReactNode
}

const PreferenceContextProvider: FC<Props> = ({ children }) => {
  const { preferenceContextValue } = usePreferenceContext()
  const { setTheme } = useTheme()

  setTheme(preferenceContextValue.preference.theme)

  return (
    <PreferenceContext.Provider value={preferenceContextValue}>
      {children}
    </PreferenceContext.Provider>
  )
}

export default PreferenceContextProvider
