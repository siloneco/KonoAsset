import { Result } from '@/lib/bindings'
import { useEffect, useState } from 'react'

type Props = {
  imagePath: string | null
  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
}

type ReturnProps = {
  imageSrc: string | undefined
  imageLoading: boolean
}

export const useAssetCardListStyle = ({
  imagePath,
  resolveImageAbsolutePath,
}: Props): ReturnProps => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined)
  const [imageLoading, setImageLoading] = useState(false)

  useEffect(() => {
    let ignore = false
    if (imagePath === null) return

    setImageLoading(true)

    resolveImageAbsolutePath(imagePath)
      .then((result) => {
        if (ignore) return
        if (result.status === 'ok') setImageSrc(result.data)
        else setImageSrc(undefined)
      })
      .finally(() => {
        if (ignore) return
        setImageLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [imagePath, resolveImageAbsolutePath])

  return {
    imageSrc,
    imageLoading,
  }
}
