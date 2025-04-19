import { LanguageCode, LocalizationData } from '@/lib/bindings'
import { createContext, FC } from 'react'
import { useLocalizationContext } from './hook'

export type LocalizationContextType = {
  data: LocalizationData
  loadBundledLanguageFile(
    code: Exclude<LanguageCode, { 'user-provided': string }>,
  ): Promise<void>
  loadLanguageFile: (path: string) => Promise<void>
}

export const LocalizationContext = createContext<LocalizationContextType>({
  data: {
    language: 'en-US',
    data: {},
  },
  loadBundledLanguageFile: async () => {},
  loadLanguageFile: async () => {},
})

type Props = {
  children: React.ReactNode
}

export const LocalizationContextProvider: FC<Props> = ({ children }) => {
  const contextValue = useLocalizationContext()

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  )
}
