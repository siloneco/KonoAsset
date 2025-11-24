import { useLocalization } from '@/hooks/use-localization'
import { useToast } from '@/hooks/use-toast'
import { commands, events } from '@/lib/bindings'
import { UnlistenFn } from '@tauri-apps/api/event'
import { useCallback, useState } from 'react'

type ReturnProps = {
  dialogOpen: boolean
  setDialogOpen: (dialogOpen: boolean) => void

  loading: boolean
  amountOfOptimizableThumbnails: number
  amountOfDeletableThumbnails: number

  inProgress: boolean
  startOptimization: () => Promise<void>

  progress: number
  filename: string
}

export const useThumbnailOptimizeDialog = (): ReturnProps => {
  const { toast } = useToast()
  const { t } = useLocalization()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [amountOfOptimizableThumbnails, setAmountOfOptimizableThumbnails] =
    useState(0)
  const [amountOfDeletableThumbnails, setAmountOfDeletableThumbnails] =
    useState(0)

  const [inProgress, setInProgress] = useState(false)
  const [progress, setProgress] = useState(0)
  const [filename, setFilename] = useState('')

  const wrappedSetDialogOpen = useCallback((dialogOpen: boolean) => {
    setDialogOpen(dialogOpen)
    setLoading(true)

    if (dialogOpen) {
      commands.optimizeImagesDirectory('dryRun').then((result) => {
        if (result.status === 'error') {
          console.error(result.error)
          return
        }

        const data = result.data

        setAmountOfOptimizableThumbnails(data.resized)
        setAmountOfDeletableThumbnails(data.deleted)
        setLoading(false)
      })
    } else {
      setAmountOfOptimizableThumbnails(0)
      setAmountOfDeletableThumbnails(0)
      setProgress(0)
      setFilename('')
    }
  }, [])

  const startOptimization = useCallback(async () => {
    setInProgress(true)
    let unlisten: UnlistenFn | undefined

    try {
      unlisten = await events.progressEvent.listen((e) => {
        setProgress(e.payload.percentage)
        setFilename(e.payload.filename)
      })

      const result = await commands.optimizeImagesDirectory('actualRun')

      if (result.status === 'error') {
        console.error(result.error)
        toast({
          title: t('general:toast-error-description'),
          description: result.error,
        })
        return
      }

      toast({
        title: t('preference:thumbnail-optimizer:dialog:completed'),
      })
      setDialogOpen(false)
    } finally {
      unlisten?.()
      setInProgress(false)
    }
  }, [toast, t])

  return {
    dialogOpen,
    setDialogOpen: wrappedSetDialogOpen,
    loading,
    amountOfOptimizableThumbnails,
    amountOfDeletableThumbnails,
    inProgress,
    startOptimization,
    progress,
    filename,
  }
}
