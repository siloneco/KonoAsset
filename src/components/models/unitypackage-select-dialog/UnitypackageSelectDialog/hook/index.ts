import { commands } from '@/lib/bindings'
import { ComponentProps, useContext } from 'react'
import { InternalUnitypackageSelectDialog } from '../internal'
import { useUnitypackageSelectDialogStore } from '@/stores/dialogs/UnitypackageSelectDialog'
import { useShallow } from 'zustand/react/shallow'
import { PreferenceContext } from '@/components/context/PreferenceContext'

type ReturnProps = ComponentProps<typeof InternalUnitypackageSelectDialog>

export const useUnitypackageSelectDialog = (): ReturnProps => {
  const { preference, setPreference } = useContext(PreferenceContext)

  const { dialogOpen, setDialogOpen, assetId, unitypackageFiles } =
    useUnitypackageSelectDialogStore(
      useShallow((state) => {
        return {
          dialogOpen: state.isOpen,
          setDialogOpen: state.setOpen,
          assetId: state.assetId,
          unitypackageFiles: state.unitypackageFiles,
        }
      }),
    )

  const openManagedDir = async () => {
    if (assetId === null) {
      console.error('Unable to open managed dir without assetId')
      return
    }

    const result = await commands.openManagedDir(assetId)
    if (result.status === 'error') {
      console.error(result.error)
    }
  }

  const setAndSaveSkipDialogPreference = async (skipDialog: boolean) => {
    await setPreference(
      { ...preference, useUnitypackageSelectedOpen: !skipDialog },
      true,
    )
  }

  const openFileInFileManager = async (filepath: string) => {
    const result = await commands.openFileInFileManager(filepath)
    if (result.status === 'error') {
      console.error(result.error)
    } else {
      setDialogOpen(false)
    }
  }

  // reverse the preference to match the UI
  const skipDialogPreferenceEnabled = !preference.useUnitypackageSelectedOpen

  return {
    dialogOpen,
    setDialogOpen,
    unitypackageFiles: unitypackageFiles ?? {},
    skipDialogPreferenceEnabled,
    setAndSaveSkipDialogPreference,
    openFileInFileManager,
    openManagedDir,
  }
}
