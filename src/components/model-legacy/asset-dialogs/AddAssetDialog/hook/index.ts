import {
  DragDropContext,
  DragDropRegisterConfig,
} from '@/components/context/DragDropContext'
import { useToast } from '@/hooks/use-toast'
import { AssetSummary, AssetType, commands, events } from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Event, UnlistenFn } from '@tauri-apps/api/event'
import { DragDropEvent } from '@tauri-apps/api/window'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AddAssetDialogContextType } from '..'
import { createPreAsset, sendAssetImportRequest } from '../logic'
import { PreferenceContext } from '@/components/context/PreferenceContext'
import { useLocalization } from '@/hooks/use-localization'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'

type Props = {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}

type ReturnProps = {
  form: AssetFormType
  contextValue: AddAssetDialogContextType
  tab: string
  setTab: (tab: string) => void
  imageUrls: string[]
  setImageUrls: (urls: string[]) => void
  existingPaths: string[]
  nonExistingPaths: string[]
  importTaskId: string | null
  onTaskCompleted: () => void
  onTaskCancelled: () => void
  onTaskFailed: (error: string | null) => void
  validatePaths: () => Promise<boolean>
  submit: (ignoreNonExistingPaths: boolean) => Promise<void>
  submitting: boolean
}

export const useAddAssetDialog = ({
  dialogOpen,
  setDialogOpen,
}: Props): ReturnProps => {
  const [tab, setTab] = useState('selector')
  const [assetPaths, setAssetPaths] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [duplicateWarningItems, setDuplicateWarningItems] = useState<
    AssetSummary[]
  >([])
  const [importTaskId, setImportTaskId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [existingPaths, setExistingPaths] = useState<string[]>([])
  const [nonExistingPaths, setNonExistingPaths] = useState<string[]>([])

  // 1以上の場合、その回数だけフォームのリセットを行わずにダイアログを開く
  const [formClearSuppressionCount, setFormClearSuppressionCount] = useState(0)

  const { toast } = useToast()
  const { t } = useLocalization()

  const refreshAssetSummaries = useAssetSummaryViewStore(
    (state) => state.refreshAssetSummaries,
  )
  const { register } = useContext(DragDropContext)
  const { preference } = useContext(PreferenceContext)

  const assetTypeAvatar: AssetType = 'Avatar'
  const assetTypeAvatarWearable: AssetType = 'AvatarWearable'
  const assetTypeWorldObject: AssetType = 'WorldObject'
  const assetTypeOtherAsset: AssetType = 'OtherAsset'

  const formSchema = z.object({
    assetType: z.union([
      z.literal(assetTypeAvatar),
      z.literal(assetTypeAvatarWearable),
      z.literal(assetTypeWorldObject),
      z.literal(assetTypeOtherAsset),
    ]),
    name: z.string().min(1),
    creator: z.string().min(1),
    imageFilename: z.string().nullable(),
    boothItemId: z.number().nullable(),
    tags: z.array(z.string()),
    memo: z.string().nullable(),
    dependencies: z.array(z.string()),
    category: z.string(),
    supportedAvatars: z.array(z.string()),
    publishedAt: z.number().nullable(),
  })

  const defaultValues = useMemo(
    () => ({
      name: '',
      creator: '',
      imageFilename: null,
      boothItemId: null,
      tags: [],
      memo: null,
      dependencies: [],
      category: '',
      supportedAvatars: [],
      publishedAt: null,
    }),
    [],
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetType: 'Avatar',
      ...defaultValues,
    },
  })

  const clearForm = useCallback(() => {
    form.reset({
      assetType: 'Avatar',
      ...defaultValues,
    })

    setAssetPaths([])
    setImageUrls([])
  }, [form, defaultValues, setAssetPaths, setImageUrls])

  const openDialogWithoutClearForm = useCallback(() => {
    if (dialogOpen) {
      return
    }

    setFormClearSuppressionCount((prev) => prev + 1)
    setDialogOpen(true)
  }, [dialogOpen, setFormClearSuppressionCount, setDialogOpen])

  const clearFormRef = useRef<() => void>(clearForm)
  const openDialogWithoutClearFormRef = useRef<() => void>(
    openDialogWithoutClearForm,
  )

  useEffect(() => {
    clearFormRef.current = clearForm
    openDialogWithoutClearFormRef.current = openDialogWithoutClearForm
  }, [clearForm, openDialogWithoutClearForm])

  const eventHandlingFn = useCallback(
    async (event: Event<DragDropEvent>): Promise<boolean> => {
      if (event.payload.type !== 'drop') {
        return false
      }

      // 文字をドラッグアンドドロップしようとするとpaths.lengthが0になる
      if (event.payload.paths.length <= 0) {
        return false
      }

      clearFormRef.current()

      setAssetPaths(event.payload.paths)
      setTab('booth-input')

      openDialogWithoutClearFormRef.current()

      return true
    },
    [setAssetPaths, setTab],
  )

  useEffect(() => {
    const eventHandlingConfig: DragDropRegisterConfig = {
      uniqueId: 'add-asset-dialog',
      priority: 100,
    }

    register(eventHandlingConfig, eventHandlingFn)
  }, [eventHandlingFn, register])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'n') {
        setDialogOpen(true)
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setDialogOpen])

  const prevDialogOpenRef = useRef(dialogOpen)

  useEffect(() => {
    if (!dialogOpen) {
      prevDialogOpenRef.current = dialogOpen
      return
    }

    // Only proceed if dialogOpen changed from false to true
    if (!prevDialogOpenRef.current) {
      if (formClearSuppressionCount > 0) {
        setFormClearSuppressionCount((prev) => prev - 1)
        prevDialogOpenRef.current = dialogOpen
        return
      }

      clearForm()
      setTab('selector')
    }

    prevDialogOpenRef.current = dialogOpen
  }, [dialogOpen, clearForm, formClearSuppressionCount])

  const contextValue = {
    assetPaths,
    setAssetPaths,
    duplicateWarningItems,
    setDuplicateWarningItems,
  }

  const onTaskCompleted = () => {
    toast({
      title: t('addasset:success-toast'),
      description: form.getValues('name'),
      duration: 3000,
    })

    setTab('empty')
    setDialogOpen(false)
    refreshAssetSummaries()
  }

  const onTaskCancelled = () => {
    toast({
      title: t('addasset:cancel-toast'),
      duration: 2000,
    })

    setTab('empty')
    setDialogOpen(false)
  }

  const onTaskFailed = (error: string | null) => {
    toast({
      title: t('addasset:error-toast'),
      description: error ?? t('addasset:error-toast:description'),
      duration: 3000,
    })

    setTab('empty')
    setDialogOpen(false)
  }

  const validatePaths = async (): Promise<boolean> => {
    const result = await commands.extractNonExistentPaths(assetPaths)

    if (result.status === 'error') {
      toast({
        title: t('addasset:path-confirmation:validate-failed-toast-title'),
        description: result.error,
      })
      return false
    }

    if (result.data.length === 0) {
      setExistingPaths(assetPaths)
      setNonExistingPaths([])
      return true
    }

    const extractedNonExistingPaths = result.data
    const validPaths = assetPaths.filter(
      (path) => !extractedNonExistingPaths.includes(path),
    )

    setExistingPaths(validPaths)
    setNonExistingPaths(extractedNonExistingPaths)

    setTab('path-confirmation')

    return false
  }

  const submit = async (ignoreNonExistingPaths: boolean) => {
    if (submitting) {
      return
    }

    setSubmitting(true)

    try {
      const preAssetResult = createPreAsset({
        assetType: form.getValues('assetType'),
        description: {
          name: form.getValues('name'),
          creator: form.getValues('creator'),
          imageFilename: form.getValues('imageFilename'),
          tags: form.getValues('tags'),
          memo: form.getValues('memo'),
          dependencies: form.getValues('dependencies'),
          boothItemId: form.getValues('boothItemId') ?? null,
          createdAt: new Date().getTime(),
          publishedAt: form.getValues('publishedAt') ?? null,
        },
        category: form.getValues('category'),
        supportedAvatars: form.getValues('supportedAvatars'),
      })

      if (preAssetResult.status === 'error') {
        toast({
          title: t('addasset:import-error-toast'),
          description: preAssetResult.error,
        })

        return
      }

      const paths = assetPaths.filter((path) => {
        if (!ignoreNonExistingPaths) {
          return true
        }

        return existingPaths.includes(path)
      })

      const result = await sendAssetImportRequest(
        form.getValues('assetType'),
        paths,
        preAssetResult.data,
        preference.deleteOnImport,
      )

      if (result.status === 'ok') {
        setImportTaskId(result.data)
        setTab('progress')
        return
      }

      console.error(result.error)

      toast({
        title: t('addasset:import-start-error-toast'),
        description: result.error,
      })
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    let isCancelled = false
    let unlistenCompleteFn: UnlistenFn | undefined = undefined

    const setupListener = async () => {
      try {
        unlistenCompleteFn = await events.addAssetDeepLink.listen((e) => {
          if (isCancelled) return

          const path = e.payload.path
          const boothItemId = e.payload.boothItemId

          clearForm()

          setAssetPaths(path)
          form.setValue('boothItemId', boothItemId)

          setTab('booth-input')

          openDialogWithoutClearForm()
        })

        if (isCancelled) {
          unlistenCompleteFn()
          return
        }

        await commands.requestStartupDeepLinkExecution()
      } catch (error) {
        console.error('Failed to listen to add asset deep link event:', error)
      }
    }

    setupListener()

    return () => {
      isCancelled = true
      unlistenCompleteFn?.()
    }
  }, [form, clearForm, openDialogWithoutClearForm])

  return {
    form,
    contextValue,
    tab,
    setTab,
    imageUrls,
    setImageUrls,
    existingPaths,
    nonExistingPaths,
    importTaskId,
    onTaskCompleted,
    onTaskCancelled,
    onTaskFailed,
    validatePaths,
    submit,
    submitting,
  }
}
