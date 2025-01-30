import { sep } from '@tauri-apps/api/path'

export const truncateFilename = (filename: string): string => {
  if (filename.length < 50) {
    return filename
  }

  const separator = sep()

  const split = filename.split(separator)

  let prefix = ''

  while (prefix.length < 30 && split.length > 2) {
    prefix += split.shift() + separator
  }

  return prefix + ' ... ' + separator + split.pop()
}
