import { PreferenceContext } from '@/components/context/PreferenceContext'
import { AssetSubmissionData } from '@/components/presentation/asset-form/AssetFormForAdd/AssetFormForAdd'
import {
  AssetSummary,
  AssetType,
  BoothAssetInfo,
  commands,
  PreferenceStore,
  Result,
} from '@/lib/bindings'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  downloadImageFromUrl,
  fetchBoothInformation,
  getAssetSummariesByBoothId,
  getCategoryCandidates,
  getNonExistentPaths,
  getSupportedAvatarCandidates,
  getTagCandidates,
  openAssetManagedDir,
  openFileOrDirSelector,
  resolveImageAbsolutePath,
  searchAssetsByText,
  submit,
} from '../logic'
import { AssetFilterContext } from '@/components/functional/AssetFilterContext'
import { useProgressEvent } from '@/hooks/use-progress-event'
import { useAssetSummaryStore } from '@/stores/AssetSummaryStore'
import { useTaskStatus } from '@/hooks/use-task-status'
import { useToast } from '@/hooks/use-toast'
import { useLocalization } from '@/hooks/use-localization'
import { PersistentContext } from '@/components/context/PersistentContext'
import {
  DragDropContext,
  DragDropRegisterConfig,
} from '@/components/context/DragDropContext'
import { Event } from '@tauri-apps/api/event'
import { DragDropEvent } from '@tauri-apps/api/window'

type Props = {
  setDialogOpen: (open: boolean) => void
}

type ReturnProps = {
  preference: Pick<PreferenceStore, 'zipExtraction' | 'deleteOnImport'> & {
    setDeleteOnImport: (deleteOnImport: boolean) => Promise<void>
  }
  assetSummaries: AssetSummary[]
  assetSubmissionData: AssetSubmissionData
  openFileOrDirSelector: (
    type: 'file' | 'directory',
  ) => Promise<string[] | null>
  fetchBoothInformation: (
    boothItemId: number,
  ) => Promise<Result<BoothAssetInfo, string>>
  getAssetSummariesByBoothId: (
    boothItemId: number,
  ) => Promise<Result<AssetSummary[], string>>
  downloadImageFromUrl: (url: string) => Promise<Result<string, string>>
  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
  openAssetManagedDir: (assetId: string) => Promise<void>
  searchAssetsByText: (text: string) => Promise<Result<string[], string>>
  getNonExistentPaths: (paths: string[]) => Promise<Result<string[], string>>
  submit: () => Promise<void>
  submitProgress?: {
    filename: string
    progress: number
    cancel: () => Promise<void>
  }
}

export const useAssetFormForAddContainer = ({
  setDialogOpen,
}: Props): ReturnProps => {
  const [submitInProgress, setSubmitInProgress] = useState(false)
  const [submitTaskId, setSubmitTaskId] = useState<string | null>(null)

  const { preference, setPreference } = useContext(PreferenceContext)
  const { sortBy } = useContext(PersistentContext)
  const { sortedAssetSummaries, refreshAssetSummaries } = useAssetSummaryStore()
  const { register } = useContext(DragDropContext)

  const { filename, progress } = useProgressEvent()
  const assetSubmissionData = useAssetSubmissionData()

  const { toast } = useToast()
  const { t } = useLocalization()

  useTaskStatus({
    taskId: submitTaskId,
    onCompleted: () => {
      setSubmitInProgress(false)
      setDialogOpen(false)
      setSubmitTaskId(null)

      refreshAssetSummaries(sortBy)
    },
    onCancelled: () => {
      setSubmitInProgress(false)
      setDialogOpen(false)
      setSubmitTaskId(null)

      toast({
        title: t('general:cancelled'),
      })
    },
    onFailed: (error) => {
      console.error(error)
      setSubmitInProgress(false)
      setDialogOpen(false)
      setSubmitTaskId(null)

      toast({
        title: t('addasset:error-toast'),
        description: error ?? undefined,
      })
    },
  })

  const setSubmissionDataItems = assetSubmissionData.items.setValue
  const eventHandlingFn = useCallback(
    async (event: Event<DragDropEvent>): Promise<boolean> => {
      if (event.payload.type !== 'drop') {
        return false
      }

      // 文字をドラッグアンドドロップしようとするとpaths.lengthが0になる
      if (event.payload.paths.length <= 0) {
        return false
      }

      setSubmissionDataItems(event.payload.paths)
      setDialogOpen(true)

      return true
    },
    [setDialogOpen, setSubmissionDataItems],
  )

  useEffect(() => {
    const eventHandlingConfig: DragDropRegisterConfig = {
      uniqueId: 'add-asset-dialog',
      priority: 100,
    }

    register(eventHandlingConfig, eventHandlingFn)
  }, [eventHandlingFn, register])

  const setDeleteOnImport = useCallback(
    async (deleteOnImport: boolean) =>
      setPreference({ ...preference, deleteOnImport }, true),
    [preference, setPreference],
  )

  const submitHook = useCallback(async () => {
    setSubmitInProgress(true)
    const taskId = await submit(assetSubmissionData, preference.deleteOnImport)
    setSubmitTaskId(taskId)
  }, [assetSubmissionData, preference.deleteOnImport, setSubmitTaskId])

  const cancelTask = useCallback(async () => {
    if (submitTaskId === null) {
      setSubmitInProgress(false)
      return
    }

    const result = await commands.cancelTaskRequest(submitTaskId)

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    setSubmitInProgress(false)
  }, [submitTaskId, setSubmitInProgress])

  const submitProgress = useMemo(() => {
    if (!submitInProgress) {
      return null
    }

    return {
      filename,
      progress,
      cancel: cancelTask,
    }
  }, [submitInProgress, filename, progress, cancelTask])

  return {
    preference: {
      zipExtraction: preference.zipExtraction,
      deleteOnImport: preference.deleteOnImport,
      setDeleteOnImport,
    },
    assetSummaries: sortedAssetSummaries,
    assetSubmissionData,
    openFileOrDirSelector,
    fetchBoothInformation,
    getAssetSummariesByBoothId,
    downloadImageFromUrl,
    resolveImageAbsolutePath,
    openAssetManagedDir,
    searchAssetsByText,
    getNonExistentPaths,
    submit: submitHook,
    submitProgress: submitProgress ?? undefined,
  }
}

const useAssetSubmissionData = (): AssetSubmissionData => {
  const [items, setItems] = useState<string[]>([])
  const [type, setType] = useState<AssetType>('Avatar')
  const [image, setImage] = useState<string | null>(null)
  const [name, setName] = useState<string>('')
  const [creator, setCreator] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState<string | null>(null)
  const [supportedAvatars, setSupportedAvatars] = useState<string[]>([])
  const [assetMemo, setAssetMemo] = useState<string>('')
  const [assetDependencies, setAssetDependencies] = useState<string[]>([])

  const { matchedAssetIds } = useContext(AssetFilterContext)

  const resetAll = useCallback(() => {
    setItems([])
    setType('Avatar')
    setImage(null)
    setName('')
    setCreator('')
    setTags([])
    setCategory(null)
    setSupportedAvatars([])
    setAssetMemo('')
    setAssetDependencies([])
  }, [
    setItems,
    setType,
    setImage,
    setName,
    setCreator,
    setTags,
    setCategory,
    setSupportedAvatars,
    setAssetMemo,
    setAssetDependencies,
  ])

  const getTagCandidatesProp = useCallback(
    async (type: AssetType) => getTagCandidates(type, matchedAssetIds),
    [matchedAssetIds],
  )

  const getCategoryCandidatesProp = useCallback(
    async (type: Omit<AssetType, 'Avatar'>) =>
      getCategoryCandidates(type, matchedAssetIds),
    [matchedAssetIds],
  )

  const getSupportedAvatarCandidatesProp = useCallback(
    async () => getSupportedAvatarCandidates(matchedAssetIds),
    [matchedAssetIds],
  )

  return {
    items: {
      value: items,
      setValue: setItems,
    },
    type: {
      value: type,
      setValue: setType,
    },
    image: {
      value: image,
      setValue: setImage,
    },
    name: {
      value: name,
      setValue: setName,
    },
    creator: {
      value: creator,
      setValue: setCreator,
    },
    tags: {
      value: tags,
      setValue: setTags,
      getCandidates: getTagCandidatesProp,
    },
    category: {
      value: category,
      setValue: setCategory,
      getCandidates: getCategoryCandidatesProp,
    },
    supportedAvatars: {
      value: supportedAvatars,
      setValue: setSupportedAvatars,
      getCandidates: getSupportedAvatarCandidatesProp,
    },
    assetMemo: {
      value: assetMemo,
      setValue: setAssetMemo,
    },
    assetDependencies: {
      value: assetDependencies,
      setValue: setAssetDependencies,
    },
    resetAll,
  }
}
