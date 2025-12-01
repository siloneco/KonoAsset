import { PreferenceContext } from '@/components/context/PreferenceContext'
import { useLocalization } from '@/hooks/use-localization'
import { toast } from '@/hooks/use-toast'
import { commands } from '@/lib/bindings'
import { open } from '@tauri-apps/plugin-dialog'
import { useCallback, useContext } from 'react'

type ReturnProps = {
  currentPath: string
  openDirectory: () => void
  selectPath: () => Promise<void>
}

export const useDataPathSelector = (): ReturnProps => {
  const { t } = useLocalization()

  const { preference, setPreference } = useContext(PreferenceContext)

  const path = preference.dataDirPath

  const setPath = useCallback(
    async (path: string) => {
      const result = await commands.migrateDataDir(path, false)

      if (result.status === 'ok') {
        setPreference({ ...preference, dataDirPath: path }, false)
        return
      }

      console.error(result.error)
      toast({
        title: t('preference:settings:destination-select:error-toast'),
        description: result.error,
      })
    },
    [preference, setPreference, t],
  )

  const openDirectory = useCallback(async () => {
    const result = await commands.openFileInFileManager(path)

    if (result.status === 'ok') {
      return
    }

    toast({
      title: t('setup:tab:2:directory-open-error-toast'),
      description: result.error,
    })
  }, [path, t])

  const selectPath = useCallback(async () => {
    const path = await open({
      directory: true,
      canCreateDirectories: true,
      defaultPath: 'file:\\\\PC',
      multiple: false,
    })

    if (path === null) {
      return
    }

    setPath(path)
  }, [setPath])

  return {
    currentPath: path,
    openDirectory,
    selectPath,
  }
}
