import { commands, PreferenceStore } from '@/lib/bindings'

export const getPreferences = async (): Promise<PreferenceStore> => {
  const result = await commands.getPreferences()

  if (result.status === 'ok') {
    return result.data
  } else {
    console.error(result.error)
    return getDefaultPreferences()
  }
}

export const getDefaultPreferences = (): PreferenceStore => {
  return {
    dataDirPath: '',
    theme: 'system',
    skipConfirmation: {
      deleteFileOrDirOnImport: false,
      openManagedDirOnMultipleUnitypackageFound: false,
    },
  }
}
