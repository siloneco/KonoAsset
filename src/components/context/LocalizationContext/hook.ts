import { commands, LanguageCode, LocalizationData } from '@/lib/bindings'
import { useContext, useEffect, useState } from 'react'
import { LocalizationContextType } from '.'
import { PreferenceContext } from '../PreferenceContext'

export const useLocalizationContext = (): LocalizationContextType => {
  const [localizationData, setLocalizationData] = useState<LocalizationData>({
    language: 'en-US',
    data: {},
  })

  const { preference } = useContext(PreferenceContext)

  const setLanguage = async (code: LanguageCode) => {
    if (code === undefined) {
      return
    }

    const result = await commands.setLanguageCode(code)

    if (result.status == 'ok') {
      setLocalizationData(result.data)
    } else {
      console.error('Failed to set language:', result.error)
    }
  }

  useEffect(() => {
    setLanguage(preference.language)
  }, [])

  useEffect(() => {
    setLanguage(preference.language)
  }, [preference.language])

  const loadLanguageFile = async (file: string) => {
    const result = await commands.loadLanguageFile(file)

    if (result.status == 'ok') {
      setLocalizationData(result.data)
    } else {
      console.error('Failed to load language file:', result.error)
    }
  }

  return {
    data: localizationData,
    loadLanguageFile,
  }
}
