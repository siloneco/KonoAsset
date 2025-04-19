import { LocalizationContext } from '@/components/context/LocalizationContext'
import { PreferenceContext } from '@/components/context/PreferenceContext'
import { commands, LanguageCode } from '@/lib/bindings'
import { useContext } from 'react'

type ReturnProps = {
  openAppDir: () => void
  openAssetDir: () => void
  openMetadataDir: () => void
  onLanguageChanged: (
    value: Exclude<LanguageCode, { 'user-provided': string }>,
  ) => Promise<void>
}

export const useLoadErrorPage = (): ReturnProps => {
  const { preference, setPreference } = useContext(PreferenceContext)
  const { loadBundledLanguageFile } = useContext(LocalizationContext)

  const openAppDir = async () => {
    await commands.openAppDir()
  }

  const openAssetDir = async () => {
    await commands.openAssetDataDir()
  }

  const openMetadataDir = async () => {
    await commands.openMetadataDir()
  }

  const onLanguageChanged = async (
    value: Exclude<LanguageCode, { 'user-provided': string }>,
  ) => {
    await loadBundledLanguageFile(value)
    setPreference({ ...preference, language: value }, false)
  }

  return {
    openAppDir,
    openAssetDir,
    openMetadataDir,
    onLanguageChanged,
  }
}
