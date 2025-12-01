import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PreferenceStore, Result } from './bindings'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const shopBoothUrlCaptureRegex =
  /^https:\/\/[0-9a-z-]+\.booth\.pm\/items\/([0-9]+)(?:\?.*)?$/
const defaultBoothUrlCaptureRegex =
  /^https:\/\/booth\.pm\/[a-z-]{2,5}\/items\/([0-9]+)(?:\?.*)?$/

export function isBoothURL(url: string) {
  return (
    defaultBoothUrlCaptureRegex.test(url) || shopBoothUrlCaptureRegex.test(url)
  )
}

export const extractBoothItemId = (url: string): Result<number, string> => {
  if (!isBoothURL(url)) {
    return { status: 'error', error: 'Invalid Booth URL specified' }
  }

  const shopMatch = url.match(shopBoothUrlCaptureRegex)
  if (shopMatch) {
    return { status: 'ok', data: parseInt(shopMatch[1], 10) }
  }

  const defaultMatch = url.match(defaultBoothUrlCaptureRegex)
  if (defaultMatch) {
    return { status: 'ok', data: parseInt(defaultMatch[1], 10) }
  }

  return { status: 'error', error: 'Failed to parse booth URL' }
}

export const convertToBoothURL = (boothItemId: number) => {
  return `https://booth.pm/ja/items/${boothItemId}`
}

export const getDefaultPreferences = (): PreferenceStore => {
  return {
    dataDirPath: '',
    theme: 'system',
    useUnitypackageSelectedOpen: true,
    zipExtraction: true,
    deleteOnImport: false,
    useTrashBin: true,
    updateChannel: 'Stable',
    language: 'en-US',
  }
}
