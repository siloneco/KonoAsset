import { AssetContext } from '@/components/context/AssetContext'
import { DragDropContext } from '@/components/context/DragDropContext'
import { useToast } from '@/hooks/use-toast'
import { AssetSummary, AssetType, commands, events } from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UnlistenFn } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AddAssetDialogContextType } from '..'
import { createPreAsset, sendAssetImportRequest } from '../logic'
import { PreferenceContext } from '@/components/context/PreferenceContext'
import { useLocalization } from '@/hooks/use-localization'

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
  importTaskId: string | null
  onTaskCompleted: () => void
  onTaskCancelled: () => void
  onTaskFailed: (error: string | null) => void
  onSubmit: () => Promise<void>
  submitting: boolean
}

const useAddAssetDialog = ({
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

  // 1以上の場合、その回数だけフォームのリセットを行わずにダイアログを開く
  const [formClearSuppressionCount, setFormClearSuppressionCount] = useState(0)

  const { toast } = useToast()
  const { t } = useLocalization()

  const { refreshAssets } = useContext(AssetContext)
  const { current, lock } = useContext(DragDropContext)
  const { preference } = useContext(PreferenceContext)

  const currentDragDropUser = useRef<string | null>(null)

  useEffect(() => {
    currentDragDropUser.current = current
  }, [current])

  const assetTypeAvatar: AssetType = 'Avatar'
  const assetTypeAvatarWearable: AssetType = 'AvatarWearable'
  const assetTypeWorldObject: AssetType = 'WorldObject'

  const formSchema = z.object({
    assetType: z.union([
      z.literal(assetTypeAvatar),
      z.literal(assetTypeAvatarWearable),
      z.literal(assetTypeWorldObject),
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

  const defaultValues = {
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
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetType: 'Avatar',
      ...defaultValues,
    },
  })

  const clearForm = () => {
    form.reset({
      assetType: 'Avatar',
      ...defaultValues,
    })

    setAssetPaths([])
    setImageUrls([])
  }

  const openDialogWithoutClearForm = () => {
    if (dialogOpen) {
      return
    }

    setFormClearSuppressionCount((prev) => prev + 1)
    setDialogOpen(true)
  }

  useEffect(() => {
    const unlockFn = lock('AddAssetDialog')

    return () => {
      unlockFn()
    }
  }, [])

  useEffect(() => {
    let isCancelled = false
    let unlistenFn: UnlistenFn | undefined = undefined

    const setupListener = async () => {
      unlistenFn = await getCurrentWindow().onDragDropEvent((event) => {
        if (isCancelled) return
        if (currentDragDropUser.current !== 'AddAssetDialog') return

        if (event.payload.type == 'drop') {
          // 文字をドラッグアンドドロップしようとするとpaths.lengthが0になる
          if (event.payload.paths.length <= 0) {
            return
          }

          clearForm()

          setAssetPaths(event.payload.paths)
          setTab('booth-input')

          openDialogWithoutClearForm()
        }
      })

      if (isCancelled) {
        unlistenFn()
        return
      }
    }

    setupListener()

    return () => {
      isCancelled = true
      unlistenFn?.()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'n') {
        setDialogOpen(true)
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (formClearSuppressionCount > 0) {
      setFormClearSuppressionCount((prev) => prev - 1)
      return
    }

    if (dialogOpen) {
      clearForm()
      setTab('selector')
    }
  }, [dialogOpen])

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
    refreshAssets()
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

  const onSubmit = async () => {
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

      const result = await sendAssetImportRequest(
        form.getValues('assetType'),
        assetPaths!,
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
  }, [])

  return {
    form,
    contextValue,
    tab,
    setTab,
    imageUrls,
    setImageUrls,
    importTaskId,
    onTaskCompleted,
    onTaskCancelled,
    onTaskFailed,
    onSubmit,
    submitting,
  }
}

export default useAddAssetDialog
