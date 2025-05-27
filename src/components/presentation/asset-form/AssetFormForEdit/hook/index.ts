import { BoothAssetInfo, Result } from '@/lib/bindings'
import { useCallback, useState } from 'react'
import { AssetSubmissionData } from '../AssetFormForEdit'

export type AssetFormForEditDialogTabs =
  | 'booth-input'
  | 'first-input'
  | 'second-input'

type Props = {
  dialogOpen: boolean
  assetSubmissionData: AssetSubmissionData
  downloadImageFromUrl: (url: string) => Promise<Result<string, string>>
  resolveImageAbsolutePath: (path: string) => Promise<Result<string, string>>
}

type ReturnProps = {
  tab: AssetFormForEditDialogTabs
  setTab: (tab: AssetFormForEditDialogTabs) => void
  setBoothInformation: (boothInformation: BoothAssetInfo) => void
  assetImage: {
    src?: string
    loading: boolean
    indexSelector?: {
      index: number
      maxIndex: number
      setIndex: (index: number) => void
    }
    userImageProvider?: {
      openImagePathSelector: () => Promise<string | null>
      onImagePathProvided: (path: string) => void
    }
  }
}

export const useAssetFormForEdit = ({
  dialogOpen,
  assetSubmissionData,
  downloadImageFromUrl,
  resolveImageAbsolutePath,
}: Props): ReturnProps => {
  const [tab, setTab] = useState<AssetFormForEditDialogTabs>('booth-input')
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  // ダイアログが閉じられたらリセットする
  const [prevDialogOpen, setPrevDialogOpen] = useState(false)
  if (prevDialogOpen !== dialogOpen) {
    if (dialogOpen) {
      setTab('booth-input')
      assetSubmissionData.resetAll()
    }
    setPrevDialogOpen(dialogOpen)
  }

  const setName = assetSubmissionData.name.setValue
  const setCreator = assetSubmissionData.creator.setValue

  const setBoothInformation = useCallback(
    (boothInformation: BoothAssetInfo) => {
      setName(boothInformation.name)
      setCreator(boothInformation.creator)
      setImageUrls(boothInformation.imageUrls)
    },
    [setName, setCreator, setImageUrls],
  )

  const setImageIndexWrapper = useCallback(
    (index: number) => {
      setImageLoading(true)
      setImageIndex(index)

      downloadImageFromUrl(imageUrls[index])
        .then((result) => {
          if (result.status === 'error') {
            setImageSrc(null)
            return
          }

          resolveImageAbsolutePath(result.data).then((result) => {
            if (result.status === 'ok') {
              setImageSrc(result.data)
            }
          })
        })
        .finally(() => {
          setImageLoading(false)
        })
    },
    [imageUrls, setImageIndex, downloadImageFromUrl, resolveImageAbsolutePath],
  )

  return {
    tab,
    setTab,
    setBoothInformation,
    assetImage: {
      src: imageSrc ?? undefined,
      loading: imageLoading,
      indexSelector: {
        index: imageIndex,
        maxIndex: imageUrls.length,
        setIndex: setImageIndexWrapper,
      },
    },
  }
}
