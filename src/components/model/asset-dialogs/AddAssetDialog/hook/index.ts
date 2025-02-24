import { AssetContext } from '@/components/context/AssetContext'
import { DragDropContext } from '@/components/context/DragDropContext'
import { useToast } from '@/hooks/use-toast'
import { AssetSummary, AssetType } from '@/lib/bindings'
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
  const { toast } = useToast()

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

          setAssetPaths(event.payload.paths)
          setDialogOpen(true)
          setTab('booth-input')
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
    if (!dialogOpen) {
      // 閉じるときにタブが変わってしまうのが見えるため遅延を入れる
      setTimeout(() => {
        clearForm()
        setTab('selector')
      }, 500)
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
      title: 'アセットが追加されました！',
      description: form.getValues('name'),
      duration: 3000,
    })

    setTab('empty')
    setDialogOpen(false)
    refreshAssets()
  }

  const onTaskCancelled = () => {
    toast({
      title: 'キャンセルされました',
      duration: 2000,
    })

    setTab('empty')
    setDialogOpen(false)
  }

  const onTaskFailed = (error: string | null) => {
    toast({
      title: 'エラー: 追加に失敗しました',
      description: error ?? 'エラー内容はログを参照してください',
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
          title: 'データのインポートに失敗しました',
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
        title: 'データのインポートを開始できませんでした',
        description: result.error,
      })
    } finally {
      setSubmitting(false)
    }
  }

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
