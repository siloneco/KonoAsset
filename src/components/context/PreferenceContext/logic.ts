import { commands, PreferenceStore } from '@/lib/bindings'
import { getDefaultPreferences } from '@/lib/utils'

export const getPreferences = async (): Promise<PreferenceStore> => {
  const result = await commands.getPreferences()

  if (result.status === 'ok') {
    return result.data
  } else {
    console.error(result.error)
    return getDefaultPreferences()
  }
}
