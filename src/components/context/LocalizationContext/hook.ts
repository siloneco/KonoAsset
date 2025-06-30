import { commands, LanguageCode, LocalizationData } from '@/lib/bindings'
import { useContext, useEffect, useState } from 'react'
import { LocalizationContextType } from '.'
import { PreferenceContext } from '../PreferenceContext'
import { useToast } from '@/hooks/use-toast'

import enUs from '@/locales/en-US.json'
import enGb from '@/locales/en-GB.json'
import jaJp from '@/locales/ja-JP.json'
import zhCn from '@/locales/zh-CN.json'

const LANGUAGE_DATA_MAP = {
  'en-US': enUs['data'],
  'en-GB': enGb['data'],
  'ja-JP': jaJp['data'],
  'zh-CN': zhCn['data'],
}

export const getLocalizationData = (
  code: Exclude<LanguageCode, { 'user-provided': string }>,
): LocalizationData => {
  return {
    language: code,
    data: LANGUAGE_DATA_MAP[code],
  }
}

export const useLocalizationContext = (): LocalizationContextType => {
  const [localizationData, setLocalizationData] = useState<LocalizationData>({
    language: 'en-US',
    data: LANGUAGE_DATA_MAP['en-US'],
  })

  const { preference } = useContext(PreferenceContext)
  const { toast } = useToast()

  const loadBundledLanguageFile = async (
    code: Exclude<LanguageCode, { 'user-provided': string }>,
  ) => {
    setLocalizationData({
      language: code,
      data: LANGUAGE_DATA_MAP[code],
    })
  }

  useEffect(() => {
    loadBundledLanguageFile(
      preference.language as Exclude<LanguageCode, { 'user-provided': string }>,
    )
  }, [preference.language])

  const loadLanguageFile = async (path: string) => {
    const fallbackKeys = Object.keys(LANGUAGE_DATA_MAP['en-US'])
    const result = await commands.loadLanguageFile(path, fallbackKeys)

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
