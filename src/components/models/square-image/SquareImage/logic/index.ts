import { commands } from '@/lib/bindings'
import { convertFileSrc } from '@tauri-apps/api/core'

type LoadImageFromUrlProps = {
  url: string
  setLoading: (loading: boolean) => void
  setSrc: (src: string | undefined) => void
}

export const loadImageFromUrl = async ({
  url,
  setLoading,
  setSrc,
}: LoadImageFromUrlProps) => {
  // Delay the loading state to prevent flickering
  const timeout = setTimeout(() => setLoading(true), 100)

  try {
    const result = await commands.resolvePximgFilename(url)

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    const filename = result.data

    updateSrcFromFilename({
      filename,
      setSrc,
    })
  } finally {
    clearTimeout(timeout)
    setLoading(false)
  }
}

type UpdateSrcFromFilenameProps = {
  filename: string
  setSrc: (src: string | undefined) => void
}

export const updateSrcFromFilename = async ({
  filename,
  setSrc,
}: UpdateSrcFromFilenameProps) => {
  const result = await commands.getImageAbsolutePath(filename)

  if (result.status === 'error') {
    console.error(result.error)
    setSrc(undefined)
    return
  }

  setSrc(convertFileSrc(result.data))
}
