import { useLocalization } from '@/hooks/use-localization'
import { commands } from '@/lib/bindings'
import { downloadDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadImageFromUrl, updateSrcFromFilename } from '../logic'

// 不安定な画像形式やテストできなかったものはコメントアウトしています
const IMAGE_EXTENSIONS = [
  'bmp', // BMP
  // 'dds', // DDS
  'exr', // OpenEXR
  // 'ff', // Farbfeld
  // 'hdr', // Radiance HDR
  'ico', // ICO
  'jpg', // JPEG
  'jpeg', // JPEG
  'png', // PNG
  'pnm', // PNM
  'pam', // PNM (Portable Any Map)
  'pbm', // PNM (Portable BitMap)
  'pgm', // PNM (Portable GrayMap)
  'ppm', // PNM (Portable PixMap)
  // 'qoi', // QOI
  'tga', // TGA
  'tif', // TIFF
  'tiff', // TIFF
  'webp', // WebP
]

type Props = {
  filename?: string
  imageUrls?: string[]
  userImageSelectable: boolean
  onUserImageSelect?: (filename: string) => void
}

type ReturnProps = {
  src?: string
  loading: boolean
  indexSelector?: {
    index: number
    maxIndex: number
    setIndex: (index: number) => void
  }
  selectUserImage?: () => Promise<void>
  onError?: () => void
}

export const useSquareImage = ({
  filename,
  imageUrls,
  userImageSelectable,
  onUserImageSelect,
}: Props): ReturnProps => {
  const { t } = useLocalization()

  const [src, setSrc] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const [imageUrlIndex, setImageUrlIndex] = useState(0)

  useEffect(() => {
    if (!filename) {
      setSrc(undefined)
      return
    }

    setLoading(true)

    try {
      updateSrcFromFilename({
        filename,
        setSrc,
      })
    } finally {
      setLoading(false)
    }
  }, [filename])

  const [prevImageUrls, setPrevImageUrls] = useState<string[] | undefined>(
    undefined,
  )

  if (imageUrls && imageUrls.length > 0 && prevImageUrls !== imageUrls) {
    setPrevImageUrls(imageUrls)
    setImageUrlIndex(0)
  }

  const indexSelector = useMemo(() => {
    if (!imageUrls) {
      return undefined
    }

    if (imageUrls.length === 0) {
      return {
        index: 0,
        maxIndex: -1,
        setIndex: () => {},
      }
    }

    return {
      index: imageUrlIndex,
      maxIndex: imageUrls.length - 1,
      setIndex: (index: number) => {
        setImageUrlIndex(index)
        loadImageFromUrl({
          url: imageUrls[index],
          setLoading,
          setSrc,
        })
      },
    }
  }, [imageUrls, imageUrlIndex])

  const openImageSelectorAndLoad = useCallback(async () => {
    let defaultPath = 'file:\\\\PC'

    try {
      defaultPath = await downloadDir()
    } catch (error) {
      console.error(
        'Failed to get download directory (fallback to PC dir):',
        error,
      )
    }

    const path = await open({
      multiple: false,
      directory: false,
      defaultPath,
      filters: [
        {
          name: t('squareimage:image'),
          extensions: IMAGE_EXTENSIONS,
        },
      ],
    })

    if (path === null) {
      return
    }

    const result = await commands.optimizeAndImportImage(path, true)

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    const filename = result.data

    onUserImageSelect?.(filename)

    updateSrcFromFilename({
      filename,
      setSrc,
    })
  }, [t, onUserImageSelect])

  const selectUserImage = useMemo(() => {
    if (!userImageSelectable) {
      return undefined
    }

    return openImageSelectorAndLoad
  }, [userImageSelectable, openImageSelectorAndLoad])

  const onError = useCallback(() => {
    setSrc(undefined)
    console.error('Failed to load image')
  }, [])

  return {
    src,
    loading,
    indexSelector,
    selectUserImage,
    onError,
  }
}
