import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Failure, Result, Success } from './Result'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const shopBoothUrlRegex = /^https:\/\/[0-9a-z-]+\.booth\.pm\/items\/[0-9]+$/
const defaultBoothUrlRegex = /^https:\/\/booth\.pm\/[a-z-]{2,5}\/items\/[0-9]+$/

export function isBoothURL(url: string) {
  return defaultBoothUrlRegex.test(url) || shopBoothUrlRegex.test(url)
}

const shopBoothUrlCaptureRegex =
  /^https:\/\/[0-9a-z-]+\.booth\.pm\/items\/([0-9]+)$/
const defaultBoothUrlCaptureRegex =
  /^https:\/\/booth\.pm\/[a-z-]{2,5}\/items\/([0-9]+)$/

export class ParseBoothURLError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseBoothURLError'
  }
}

export const extractBoothItemId = (
  url: string,
): Result<number, ParseBoothURLError> => {
  if (!isBoothURL(url)) {
    return new Failure(new ParseBoothURLError('Not a booth URL'))
  }

  const shopMatch = url.match(shopBoothUrlCaptureRegex)
  if (shopMatch) {
    return new Success(parseInt(shopMatch[1], 10))
  }

  const defaultMatch = url.match(defaultBoothUrlCaptureRegex)
  if (defaultMatch) {
    return new Success(parseInt(defaultMatch[1], 10))
  }

  return new Failure(new ParseBoothURLError('Failed to parse booth URL'))
}

export const convertToBoothURL = (boothItemId: number) => {
  return `https://booth.pm/ja/items/${boothItemId}`
}
