import { PreferenceContext } from '@/components/context/PreferenceContext'
import { commands, LanguageCode } from '@/lib/bindings'
import { useContext } from 'react'

type ReturnProps = {
  openAppDir: () => void
  openAssetDir: () => void
  openMetadataDir: () => void
  onLanguageChanged: (value: LanguageCode) => Promise<void>
}

export const useLoadErrorPage = (): ReturnProps => {
  const { preference, setPreference } = useContext(PreferenceContext)

  const openAppDir = async () => {
    await commands.openAppDir()
  }

  const openAssetDir = async () => {
    await commands.openAssetDataDir()
  }

  const openMetadataDir = async () => {
    await commands.openMetadataDir()
  }

  const onLanguageChanged = async (value: LanguageCode) => {
    setPreference({ ...preference, language: value }, false)
  }

  return {
    openAppDir,
    openAssetDir,
    openMetadataDir,
    onLanguageChanged,
  }
}
