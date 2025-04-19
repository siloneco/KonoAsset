import { commands, LanguageCode, LocalizationData } from '@/lib/bindings'
import { useContext, useEffect, useState } from 'react'
import { LocalizationContextType } from '.'
import { PreferenceContext } from '../PreferenceContext'
import { useToast } from '@/hooks/use-toast'

export const useLocalizationContext = (): LocalizationContextType => {
  const [localizationData, setLocalizationData] = useState<LocalizationData>({
    language: 'en-US',
    data: {},
  })

  const { preference } = useContext(PreferenceContext)
  const { toast } = useToast()

  const loadBundledLanguageFile = async (
    code: Exclude<LanguageCode, { 'user-provided': string }>,
  ) => {
    const result = await commands.setLanguageCode(code)

    if (result.status == 'ok') {
      setLocalizationData(result.data)
    } else {
      console.error('Failed to set language:', result.error)
    }
  }

  useEffect(() => {
    loadBundledLanguageFile(
      preference.language as Exclude<LanguageCode, { 'user-provided': string }>,
    )
  }, [preference.language])

  const loadLanguageFile = async (path: string) => {
    const result = await commands.loadLanguageFile(path)

    if (result.status === 'error') {
      console.error(result.error)
      toast({
        title:
          localizationData.data[
            'preference:language:failed-to-load-from-file:toast:title'
          ],
        description: result.error,
      })
      return
    }

    const customLanguageLoadResult = result.data
    const languageData = customLanguageLoadResult.data

    setLocalizationData(languageData)

    const t = (id: string) => {
      const value = languageData.data[id] ?? ''

      if (value === undefined) {
        return ''
      }

      return value
    }

    const title = t('preference:language:loaded-language-file-toast:title')

    const descriptionKeyPrefix =
      'preference:language:loaded-language-file-toast:description'
    const description =
      t(`${descriptionKeyPrefix}:1`) +
      customLanguageLoadResult.missing_keys.length +
      t(`${descriptionKeyPrefix}:2`) +
      customLanguageLoadResult.additional_keys.length +
      t(`${descriptionKeyPrefix}:3`)

    toast({
      title,
      description,
    })
  }

  return {
    data: localizationData,
    loadBundledLanguageFile,
    loadLanguageFile,
  }
}
