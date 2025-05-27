import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PreferenceStore } from './bindings'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDefaultPreferences = (): PreferenceStore => {
  return {
    dataDirPath: '',
    theme: 'system',
    useUnitypackageSelectedOpen: true,
    zipExtraction: true,
    deleteOnImport: false,
    updateChannel: 'Stable',
    language: 'en-US',
  }
}
