import { AssetSummary, BoothAssetInfo, Result } from '@/lib/bindings'
import { useCallback, useMemo, useState } from 'react'
import { AssetSubmissionData } from '../AssetFormForAdd'

export type AssetFormForAddDialogTabs =
  | 'item-selector'
  | 'booth-input'
  | 'duplicate-warning'
  | 'type-selector'
  | 'first-input'
  | 'second-input'
  | 'path-confirmation'
  | 'progress'

type Props = {
  dialogOpen: boolean
  assetSubmissionData: AssetSubmissionData
  getAssetSummariesByBoothId: (
    boothItemId: number,
  ) => Promise<Result<AssetSummary[], string>>
  downloadImageFromUrl: (url: string) => Promise<Result<string, string>>
  resolveImageAbsolutePath: (path: string) => Promise<Result<string, string>>
  getNonExistentPaths: (paths: string[]) => Promise<Result<string[], string>>
  submit: () => Promise<void>
}

type ReturnProps = {
  tab: AssetFormForAddDialogTabs
  setTab: (tab: AssetFormForAddDialogTabs) => void
  setBoothInformation: (boothInformation: BoothAssetInfo) => void
  duplicateAssetSummaries: AssetSummary[]
  checkDuplicateAsset: (
    boothItemId: number,
  ) => Promise<'ok' | 'movedToDuplicateTab'>
  onSubmitButtonClickInSecondInputTab: () => Promise<void>
  existentPaths: string[]
  nonExistentPaths: string[]
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

export const useAssetFormForAdd = ({
  dialogOpen,
  assetSubmissionData,
  getAssetSummariesByBoothId,
  downloadImageFromUrl,
  resolveImageAbsolutePath,
  getNonExistentPaths,
  submit,
}: Props): ReturnProps => {
  const [tab, setTab] = useState<AssetFormForAddDialogTabs>('item-selector')
  const [duplicateAssetSummaries, setDuplicateAssetSummaries] = useState<
    AssetSummary[]
  >([])
  const [nonExistentPaths, setNonExistentPaths] = useState<string[]>([])

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  // ダイアログが閉じられたらリセットする
  const [prevDialogOpen, setPrevDialogOpen] = useState(false)
  if (prevDialogOpen !== dialogOpen) {
    if (dialogOpen) {
      setTab('item-selector')
      assetSubmissionData.resetAll()
    }
    setPrevDialogOpen(dialogOpen)
  }

  const checkDuplicateAsset = useCallback(
    async (boothItemId: number) => {
      const result = await getAssetSummariesByBoothId(boothItemId)
      if (result.status === 'ok' && result.data.length > 0) {
        setDuplicateAssetSummaries(result.data)
        return 'movedToDuplicateTab'
      }

      return 'ok'
    },
    [getAssetSummariesByBoothId],
  )

  const setName = assetSubmissionData.name.setValue
  const setCreator = assetSubmissionData.creator.setValue
  const setType = assetSubmissionData.type.setValue

  const setBoothInformation = useCallback(
    (boothInformation: BoothAssetInfo) => {
      setName(boothInformation.name)
      setCreator(boothInformation.creator)
      setImageUrls(boothInformation.imageUrls)

      if (boothInformation.estimatedAssetType !== null) {
        setType(boothInformation.estimatedAssetType)
      }
    },
    [setName, setCreator, setImageUrls, setType],
  )

  const onSubmitButtonClickInSecondInputTab = useCallback(async () => {
    const result = await getNonExistentPaths(assetSubmissionData.items.value)

    if (result.status === 'ok' && result.data.length > 0) {
      setNonExistentPaths(result.data)
      setTab('path-confirmation')
      return
    }

    await submit()
    setTab('progress')
  }, [assetSubmissionData.items.value, getNonExistentPaths, submit])

  const existentPaths = useMemo(() => {
    return assetSubmissionData.items.value.filter((path) => {
      return !nonExistentPaths.includes(path)
    })
  }, [assetSubmissionData.items.value, nonExistentPaths])

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
    duplicateAssetSummaries,
    checkDuplicateAsset,
    onSubmitButtonClickInSecondInputTab,
    existentPaths,
    nonExistentPaths,
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
