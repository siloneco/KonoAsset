import { LocalizationData } from '@/lib/bindings'
import { createContext, FC } from 'react'
import { useLocalizationContext } from './hook'

export type LocalizationContextType = {
  data: LocalizationData
  loadLanguageFile: (path: string) => Promise<void>
}

export const LocalizationContext = createContext<LocalizationContextType>({
  data: {
    language: 'ja-JP',
    data: {},
  },
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
