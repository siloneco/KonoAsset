import { commands } from '@/lib/bindings'

type ReturnProps = {
  openAppDir: () => void
  openAssetDir: () => void
  openMetadataDir: () => void
}

export const useLoadErrorPage = (): ReturnProps => {
  const openAppDir = async () => {
    await commands.openAppDir()
  }

  const openAssetDir = async () => {
    await commands.openAssetDataDir()
  }

  const openMetadataDir = async () => {
    await commands.openMetadataDir()
  }

  return { openAppDir, openAssetDir, openMetadataDir }
}
