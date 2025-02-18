import { commands } from '@/lib/bindings'
import { downloadDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'
import { useState } from 'react'

type Props = {
  setFilename?: (filename: string) => void
  imageUrls?: string[]
  urlImageIndex?: number
  setUrlImageIndex?: (index: number) => void
}

type ReturnProps = {
  loading: boolean
  selectImage: () => Promise<void>
  resolveNextUrl: () => Promise<void>
  resolvePreviousUrl: () => Promise<void>
}

export const useSquareImage = ({
  setFilename,
  imageUrls,
  urlImageIndex,
  setUrlImageIndex,
}: Props): ReturnProps => {
  const [loading, setLoading] = useState(false)

  const openImageSelector = async () => {
    if (setFilename === undefined) {
      return
    }

    const path = await open({
      multiple: false,
      directory: false,
      defaultPath: await downloadDir(),
      filters: [{ name: '画像', extensions: ['png', 'jpg', 'jpeg'] }],
    })

    if (path === null) {
      return
    }

    const result = await commands.copyImageFileToImages(path, true)

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    setFilename(result.data)
    setUrlImageIndex?.(-1)
  }

  const resolveFromUrl = async (url: string) => {
    // Delay the loading state to prevent flickering
    const timeout = setTimeout(() => setLoading(true), 50)

    try {
      const result = await commands.resolvePximgFilename(url)

      if (result.status === 'error') {
        console.error(result.error)
        return
      }

      if (setFilename === undefined) {
        return
      }

      setFilename(result.data)
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  const resolveNextUrl = async () => {
    if (
      imageUrls === undefined ||
      urlImageIndex === undefined ||
      setUrlImageIndex === undefined
    ) {
      return
    }

    const nextIndex = (urlImageIndex + 1) % imageUrls.length

    await resolveFromUrl(imageUrls[nextIndex])
    setUrlImageIndex(nextIndex)
  }

  const resolvePreviousUrl = async () => {
    if (
      imageUrls === undefined ||
      urlImageIndex === undefined ||
      setUrlImageIndex === undefined
    ) {
      return
    }

    const previousIndex =
      (urlImageIndex + imageUrls.length - 1) % imageUrls.length

    await resolveFromUrl(imageUrls[previousIndex])
    setUrlImageIndex(previousIndex)
  }

  return {
    loading,
    selectImage: openImageSelector,
    resolveNextUrl,
    resolvePreviousUrl,
  }
}
