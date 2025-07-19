import { LanguageCode, LocalizationData } from '@/lib/bindings'
import { createContext, FC } from 'react'
import { getLocalizationData, useLocalizationContext } from './hook'

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
  forcedLanguage?: Exclude<LanguageCode, { 'user-provided': string }>
}

export const LocalizationContextProvider: FC<Props> = ({
  children,
  forcedLanguage,
}) => {
  const contextValue = useLocalizationContext()

  if (forcedLanguage) {
    const forcedContextValue: LocalizationContextType = {
      ...contextValue,
      data: getLocalizationData(forcedLanguage),
    }

    return (
      <LocalizationContext.Provider value={forcedContextValue}>
        {children}
      </LocalizationContext.Provider>
    )
  }

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  )
}
