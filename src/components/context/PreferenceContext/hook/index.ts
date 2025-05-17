import { useEffect, useState } from 'react'
import { commands, PreferenceStore } from '@/lib/bindings'
import { PreferenceContextType } from '..'
import { getPreferences } from '../logic'
import { getDefaultPreferences } from '@/lib/utils'

type ReturnProps = {
  preferenceContextValue: PreferenceContextType
}

let didInit = false

export const usePreferenceContext = (): ReturnProps => {
  const [preference, setPreference] = useState<PreferenceStore>(
    getDefaultPreferences(),
  )

  useEffect(() => {
    if (didInit) {
      return
    }

    didInit = true

    getPreferences().then((pref) => {
      setPreference(pref)
    })
  }, [])

  const setPreferenceWithSave = async (
    pref: PreferenceStore,
    save: boolean,
  ) => {
    if (save) {
      const result = await commands.setPreferences(pref)

      if (result.status === 'ok') {
        setPreference(pref)
      } else {
        console.error(result.error)
      }
    } else {
      setPreference(pref)
    }
  }

  const preferenceContextValue: PreferenceContextType = {
    preference,
    setPreference: setPreferenceWithSave,
  }

  return { preferenceContextValue }
}
