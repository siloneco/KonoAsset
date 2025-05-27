import { LanguageCode, Result } from '../bindings'

const LANG_CODE_TO_BOOTH_LANG_CODE = {
  'ja-JP': 'ja',
  'en-US': 'en',
  'en-GB': 'en',
  'zh-CN': 'zh-cn',
}

const shopBoothUrlRegex = /^https:\/\/[0-9a-z-]+\.booth\.pm\/items\/[0-9]+$/
const defaultBoothUrlRegex = /^https:\/\/booth\.pm\/[a-z-]{2,5}\/items\/[0-9]+$/

const shopBoothUrlCaptureRegex =
  /^https:\/\/[0-9a-z-]+\.booth\.pm\/items\/([0-9]+)$/
const defaultBoothUrlCaptureRegex =
  /^https:\/\/booth\.pm\/[a-z-]{2,5}\/items\/([0-9]+)$/

export const convertToBoothURL = (
  boothItemId: number,
  languageCode: LanguageCode,
) => {
  let code: Exclude<LanguageCode, { 'user-provided': string }>

  if (typeof languageCode === 'string') {
    code = languageCode
  } else {
    code = 'en-US'
  }

  return `https://booth.pm/${LANG_CODE_TO_BOOTH_LANG_CODE[code]}/items/${boothItemId}`
}

export function isBoothURL(url: string) {
  return defaultBoothUrlRegex.test(url) || shopBoothUrlRegex.test(url)
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
